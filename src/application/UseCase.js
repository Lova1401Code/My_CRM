// Use Case base class — encapsulates common orchestration pattern.
// Subclasses implement execute() and return a Result.

export class UseCase {
  async execute(..._args) {
    throw new Error('Not implemented');
  }
}