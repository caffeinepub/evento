import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Attendee {
    id: bigint;
    eventId: bigint;
    name: string;
    email: string;
}
export interface UserProfile {
    name: string;
}
export interface Event {
    id: bigint;
    title: string;
    date: string;
    createdBy: Principal;
    location: string;
}
export interface InviteCode {
    code: string;
    eventId: bigint;
    created: bigint;
}
export interface RSVP {
    name: string;
    attending: boolean;
    inviteCode: string;
    eventId: bigint;
    timestamp: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAttendee(eventId: bigint, name: string, email: string): Promise<bigint>;
    addEvent(title: string, date: string, location: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteEvent(id: bigint): Promise<void>;
    generateInviteCode(eventId: bigint): Promise<string>;
    getAllEvents(): Promise<Array<Event>>;
    getAttendees(eventId: bigint): Promise<Array<Attendee>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getEventByInviteCode(inviteCode: string): Promise<Event | null>;
    getEventsByCurrentUser(): Promise<Array<Event>>;
    getInviteCodesForEvent(eventId: bigint): Promise<Array<InviteCode>>;
    getRSVPByCode(inviteCode: string): Promise<RSVP | null>;
    getRSVPsForEvent(eventId: bigint): Promise<Array<RSVP>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeAttendee(attendeeId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitRSVP(name: string, attending: boolean, inviteCode: string): Promise<void>;
}
