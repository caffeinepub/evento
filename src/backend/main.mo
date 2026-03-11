import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
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
};
