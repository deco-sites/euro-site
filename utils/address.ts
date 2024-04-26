export function formatPostalCode(pc?: string) {
  let value = pc;

  value = value?.replace(/\D/g, "");
  value = value?.replace(/^(\d{5})(\d)/, "$1-$2");

  return value;
};