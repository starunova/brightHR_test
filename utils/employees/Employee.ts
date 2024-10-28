interface Employee {
    firstName: string,
    lastName: string,
    email: string,
    registrationEmail: boolean,
    phoneNumber?: string,
    startDate?: string,
    jobTitle?: string
}

export type {Employee as Employee}