type UserRole = "employee" | "admin";

type ActionResponse<T = unknown> =
  | { error: string } // Caso con error
  | (T extends unknown
      ? { message: string } // Caso sin datos, solo mensaje
      : { data: T }); // Caso con datos
