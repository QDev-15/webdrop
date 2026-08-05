import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

(async () => {
  try {
    await client.connect();
    const result = await client.query(
      `SELECT COUNT(*) as count FROM "webdrop"."help_articles" WHERE status=$1`,
      ['published']
    );
    console.log(`Published articles: ${result.rows[0].count}`);
    await client.end();
  } catch(e) {
    console.error(e.message);
  }
})();
