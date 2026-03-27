import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Time "mo:core/Time";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profiles
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Event management
  var nextEventId = 0;
  var nextAttendeeId = 0;

  let events = Map.empty<Nat, Event>();

  type Event = {
    id : Nat;
    title : Text;
    date : Text;
    location : Text;
    createdBy : Principal;
  };

  public shared ({ caller }) func addEvent(title : Text, date : Text, location : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add events");
    };

    let eventId = nextEventId;
    nextEventId += 1;

    let newEvent : Event = {
      id = eventId;
      title;
      date;
      location;
      createdBy = caller;
    };

    events.add(eventId, newEvent);
    eventId;
  };

  public shared ({ caller }) func deleteEvent(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete events");
    };

    switch (events.get(id)) {
      case (null) { Runtime.trap("Event not found") };
      case (?event) {
        if (event.createdBy != caller) {
          Runtime.trap("Unauthorized: You can only delete your own events");
        };
        events.remove(id);
      };
    };
  };

  public query func getAllEvents() : async [Event] {
    events.values().toArray();
  };

  public query ({ caller }) func getEventsByCurrentUser() : async [Event] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their events");
    };

    events.values().toArray().filter(
      func(e) {
        e.createdBy == caller;
      }
    );
  };

  // Attendee management
  public type Attendee = {
    id : Nat;
    name : Text;
    email : Text;
    eventId : Nat;
  };

  let attendees = Map.empty<Nat, Attendee>();

  public shared ({ caller }) func addAttendee(eventId : Nat, name : Text, email : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add attendees");
    };

    if (not events.containsKey(eventId)) {
      Runtime.trap("Event does not exist");
    };

    let attendeeId = nextAttendeeId;
    nextAttendeeId += 1;

    let newAttendee : Attendee = {
      id = attendeeId;
      name;
      email;
      eventId;
    };

    attendees.add(attendeeId, newAttendee);
    attendeeId;
  };

  public query func getAttendees(eventId : Nat) : async [Attendee] {
    if (not events.containsKey(eventId)) {
      Runtime.trap("Event does not exist");
    };
    attendees.values().toArray().filter(
      func(attendee) {
        attendee.eventId == eventId;
      }
    );
  };

  public shared ({ caller }) func removeAttendee(attendeeId : Nat) : async () {
    switch (attendees.get(attendeeId)) {
      case (null) { Runtime.trap("Attendee not found") };
      case (?attendee) {
        switch (events.get(attendee.eventId)) {
          case (null) { Runtime.trap("Event does not exist") };
          case (?event) {
            if (event.createdBy != caller and not AccessControl.isAdmin(accessControlState, caller)) {
              Runtime.trap("Unauthorized: You must be the creator of the event or an admin");
            };
            attendees.remove(attendeeId);
          };
        };
      };
    };
  };

  // Invite links
  public type InviteCode = {
    code : Text;
    eventId : Nat;
    created : Time.Time;
  };

  let inviteCodes = Map.empty<Text, InviteCode>();

  public type RSVP = {
    name : Text;
    attending : Bool;
    inviteCode : Text;
    eventId : Nat;
    timestamp : Time.Time;
  };

  let rsvps = Map.empty<Text, RSVP>();

  public shared ({ caller }) func generateInviteCode(eventId : Nat) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized");
    };
    switch (events.get(eventId)) {
      case (null) { Runtime.trap("Event not found") };
      case (?event) {
        if (event.createdBy != caller) {
          Runtime.trap("Unauthorized: Only event creator can generate invite codes");
        };
        let code = "evt" # eventId.toText() # "-" # Time.now().toText();
        let invite : InviteCode = {
          code;
          eventId;
          created = Time.now();
        };
        inviteCodes.add(code, invite);
        code;
      };
    };
  };

  public query func getInviteCodesForEvent(eventId : Nat) : async [InviteCode] {
    inviteCodes.values().toArray().filter(
      func(c) { c.eventId == eventId }
    );
  };

  public shared func submitRSVP(name : Text, attending : Bool, inviteCode : Text) : async () {
    switch (inviteCodes.get(inviteCode)) {
      case (null) { Runtime.trap("Invalid invite code") };
      case (?invite) {
        let rsvp : RSVP = {
          name;
          attending;
          inviteCode;
          eventId = invite.eventId;
          timestamp = Time.now();
        };
        rsvps.add(inviteCode, rsvp);
      };
    };
  };

  public query func getRSVPsForEvent(eventId : Nat) : async [RSVP] {
    rsvps.values().toArray().filter(
      func(r) { r.eventId == eventId }
    );
  };

  public query func getRSVPByCode(inviteCode : Text) : async ?RSVP {
    rsvps.get(inviteCode);
  };

  public query func getEventByInviteCode(inviteCode : Text) : async ?Event {
    switch (inviteCodes.get(inviteCode)) {
      case (null) { null };
      case (?invite) { events.get(invite.eventId) };
    };
  };
};
