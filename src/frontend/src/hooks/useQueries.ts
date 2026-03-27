import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Attendee,
  Event,
  InviteCode,
  RSVP,
  UserProfile,
} from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllEvents() {
  const { actor, isFetching } = useActor();
  return useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEvents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useAddEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      date,
      location,
    }: {
      title: string;
      date: string;
      location: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addEvent(title, date, location);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useDeleteEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteEvent(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useGetAttendees(eventId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<Attendee[]>({
    queryKey: ["attendees", eventId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAttendees(eventId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllAttendeesCount() {
  const { actor, isFetching } = useActor();
  const eventsQuery = useGetAllEvents();
  const events = eventsQuery.data ?? [];

  return useQuery<number>({
    queryKey: [
      "allAttendeesCount",
      events.map((e) => e.id.toString()).join(","),
    ],
    queryFn: async () => {
      if (!actor || events.length === 0) return 0;
      const results = await Promise.all(
        events.map((e) => actor.getAttendees(e.id)),
      );
      return results.reduce((sum, a) => sum + a.length, 0);
    },
    enabled: !!actor && !isFetching && eventsQuery.isSuccess,
  });
}

export function useAddAttendee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      eventId,
      name,
      email,
    }: {
      eventId: bigint;
      name: string;
      email: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addAttendee(eventId, name, email);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["attendees", variables.eventId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["allAttendeesCount"] });
    },
  });
}

export function useRemoveAttendee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      attendeeId,
      eventId: _eventId,
    }: {
      attendeeId: bigint;
      eventId: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeAttendee(attendeeId);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["attendees", variables.eventId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["allAttendeesCount"] });
    },
  });
}

// ─── Invite & RSVP hooks ───────────────────────────────────────────────────
// Note: cast actor to `any` because backend.ts is auto-generated and
// doesn't yet include the invite/RSVP methods defined in backend.d.ts

export function useGenerateInviteCode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (eventId: bigint): Promise<string> => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).generateInviteCode(eventId);
    },
    onSuccess: (_data, eventId) => {
      queryClient.invalidateQueries({
        queryKey: ["inviteCodes", eventId.toString()],
      });
    },
  });
}

export function useGetInviteCodesForEvent(eventId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<InviteCode[]>({
    queryKey: ["inviteCodes", eventId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getInviteCodesForEvent(eventId) as Promise<
        InviteCode[]
      >;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRSVPsForEvent(eventId: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<RSVP[]>({
    queryKey: ["rsvps", eventId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getRSVPsForEvent(eventId) as Promise<RSVP[]>;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitRSVP() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      name,
      attending,
      inviteCode,
    }: {
      name: string;
      attending: boolean;
      inviteCode: string;
    }): Promise<void> => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).submitRSVP(name, attending, inviteCode);
    },
  });
}

export function useGetEventByInviteCode(inviteCode: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Event | null>({
    queryKey: ["eventByCode", inviteCode],
    queryFn: async () => {
      if (!actor) return null;
      return (actor as any).getEventByInviteCode(
        inviteCode,
      ) as Promise<Event | null>;
    },
    enabled: !!actor && !isFetching && !!inviteCode,
  });
}

export function useGetRSVPByCode(inviteCode: string) {
  const { actor, isFetching } = useActor();
  return useQuery<RSVP | null>({
    queryKey: ["rsvpByCode", inviteCode],
    queryFn: async () => {
      if (!actor) return null;
      return (actor as any).getRSVPByCode(inviteCode) as Promise<RSVP | null>;
    },
    enabled: !!actor && !isFetching && !!inviteCode,
  });
}
