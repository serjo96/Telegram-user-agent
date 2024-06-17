export default function <T>(value: string, enums: T) {
  return enums[value as keyof typeof enums];
}
