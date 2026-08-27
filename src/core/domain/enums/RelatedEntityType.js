// Entity types an activity, task or note can be attached to.
export const RelatedEntityType = Object.freeze({
  CUSTOMER: 'CUSTOMER',
  LEAD: 'LEAD',
  DEAL: 'DEAL',
});

export const RELATED_ENTITY_TYPE_VALUES = Object.values(RelatedEntityType);

export const RELATED_ENTITY_TYPE_LABELS = {
  [RelatedEntityType.CUSTOMER]: 'Client',
  [RelatedEntityType.LEAD]: 'Prospect',
  [RelatedEntityType.DEAL]: 'Affaire',
};
