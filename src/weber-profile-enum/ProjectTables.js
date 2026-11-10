export const PROJECT_TABLES = Object.freeze({
  "maven-library": Object.freeze({
    schema: "library",
    tables: Object.freeze({
      members: Object.freeze(["member_id", "first_name", "last_name"]),
      books: Object.freeze(["id", "title", "author", "isbn", "member_id"]),
    }),
  }),

  "authors-novels": Object.freeze({
    schema: "novels",
    tables: Object.freeze({
      author: Object.freeze(["id", "name"]),
      novel: Object.freeze(["id", "title", "year", "auth_id"]),
    }),
  }),

  "spring-security": Object.freeze({
    schema: "security",
    tables: Object.freeze({
      customer: Object.freeze([
        "customer_id",
        "email_id",
        "name",
        "date_of_birth",
      ]),
    }),
  }),

  "cab-booking": Object.freeze({
    schema: "cab_booking",
    tables: Object.freeze({
      cab: Object.freeze([
        "cab_no",
        "model_name",
        "driver_phone_no",
        "availability",
      ]),
      booking: Object.freeze([
        "booking_id",
        "customer_name",
        "phone_no",
        "booking_type",
        "cab_no",
      ]),
    }),
  }),
});
