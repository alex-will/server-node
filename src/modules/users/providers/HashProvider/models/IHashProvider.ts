export default interface IHashProvider {
  generateHash(payload: string): Promise<string>;
  comparaHash(payload: string, hashed: string): Promise<boolean>;
}
