import { pool } from "./mysql.config";

// release db connection afterwards
afterEach(async () => {
  const connection = await pool.getConnection();
  connection.release();
});

describe("[database tests]", () => {
  it("should ensure app connects to database", async () => {
    const connection = await pool.getConnection();
    const [rows]: any = await connection.query(`SELECT 1+1 as results;`);

    expect(rows[0]).toMatchObject({ results: 2 });
  });

  it("should ensure 'maktaba' db is created", async () => {
    const connection = await pool.getConnection();
    const [rows]: any = await connection.query(`USE maktaba;`);

    expect(rows).toHaveProperty("warningStatus");
    expect(rows.warningStatus).toEqual(0);
    expect(rows).toHaveProperty("stateChanges.schema");
    expect(rows.stateChanges.schema).toEqual("maktaba");
  });

  it("should ensure the tables schema is present", async () => {
    const connection = await pool.getConnection();
    await connection.query("USE maktaba;");
    const rows = await connection.query("SHOW TABLES;");

    expect(rows).toEqual(expect.any(Array));
    expect(rows[0]).toHaveLength(6);
    expect(rows[0]).toContainEqual({ Tables_in_maktaba: "users" });
    expect(rows[0]).toContainEqual({ Tables_in_maktaba: "courses" });
    expect(rows[0]).toContainEqual({ Tables_in_maktaba: "course_overview" });
    expect(rows[0]).toContainEqual({ Tables_in_maktaba: "payments" });
    expect(rows[0]).toContainEqual({ Tables_in_maktaba: "ratings" });
    expect(rows[0]).toContainEqual({ Tables_in_maktaba: "subscriptions" });
  });
});
