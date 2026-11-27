// users.parentalConsentAt: fecha (servidor) del consentimiento parental de menores. Idempotente.
module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.sequelize.query(
      `ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "parentalConsentAt" timestamp with time zone`
    );
  },
  async down() {},
};
