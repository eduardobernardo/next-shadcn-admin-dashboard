import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Gennesi Superadmin",
  version: packageJson.version,
  copyright: `© ${currentYear}, Gennesi.`,
  meta: {
    title: "Gennesi Superadmin",
    description: "Painel interno para gestão de planos, cupons e organizações da plataforma Gennesi.",
  },
};
