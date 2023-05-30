export type User = {
  email: string
  email_verified: boolean
  name: string
  nickname: string
  picture: string
  sub: string
  updated_at: string
}

export type Instrument = {
  success: Boolean
  instrument_id?: string
  instrument?: string
  instructors?: IndexedStringList
  courses?: IndexedStringList
  error?: number
  message?: string
}

export type Instructor = {
  success: Boolean
  instructor_id?: string
  name?: string
  workdays?: Weekdays[]
  instruments?: IndexedStringList
  courses_taught?: IndexedStringList
  error?: number
  message?: string
}

export type Course = {
  title: string
  instrument: string
  schedule: string[]
  instructors: string[]
}

export type InstructorInfo = {
  instructor: string
  instruments: string[]
}

export type IndexedStringList = {
  [index: string]: string
}

export type IndexedInstructorList = {
  [index: string]: InstructorInfo
}

export type IndexedCourseList = {
  [index: string]: IndexedStringList
}

export type DecodedJwt = {
  iss: string
  sub: string
  aud: string[]
  iat: string
  exp: string
  azp: string
  scope: string
  permissions: string[]
}

export enum Weekdays {
  Sun = "Sun",
  Mon = "Mon",
  Tue = "Tue",
  Wed = "Wed",
  Thu = "Thu",
  Fri = "Fri",
  Sat = "Sat"
}