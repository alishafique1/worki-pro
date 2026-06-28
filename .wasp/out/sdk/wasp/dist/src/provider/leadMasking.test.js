import { describe, it, expect } from 'vitest';
import { maskLead, FORBIDDEN_LEAD_FIELDS } from './leadMasking';
// Regression guard for the core trust/legal primitive: the public lead feed
// must NEVER leak a consumer's name, phone, or email to a browsing provider.
const rawWithPii = {
    id: 'req_1',
    createdAt: new Date('2026-01-01T00:00:00Z'),
    serviceCategory: { name: 'Plumbing', slug: 'plumbing' },
    postalCode: 'L9T 1A1',
    city: 'Milton',
    urgency: 'URGENT',
    description: 'Leaky faucet under the kitchen sink',
    estimatedSchedule: 'This week',
    status: 'NEW',
    assignedProviderId: null,
    // PII that must be stripped:
    name: 'Sarah Chen',
    phone: '+1 416 555 0199',
    email: 'sarah.chen@example.com',
};
describe('maskLead', () => {
    it('drops every forbidden PII key from the output', () => {
        const masked = maskLead(rawWithPii);
        for (const field of FORBIDDEN_LEAD_FIELDS) {
            expect(masked).not.toHaveProperty(field);
        }
    });
    it('does not leak any PII value anywhere in the serialized lead', () => {
        const serialized = JSON.stringify(maskLead(rawWithPii));
        expect(serialized).not.toContain('Sarah Chen');
        expect(serialized).not.toContain('416 555 0199');
        expect(serialized).not.toContain('sarah.chen@example.com');
    });
    it('still exposes the non-PII fields a provider needs to evaluate a lead', () => {
        const masked = maskLead(rawWithPii);
        expect(masked.id).toBe('req_1');
        expect(masked.postalCode).toBe('L9T 1A1');
        expect(masked.serviceCategory).toEqual({ name: 'Plumbing', slug: 'plumbing' });
        expect(masked.urgency).toBe('URGENT');
    });
    it('marks a lead claimed when it has an assigned provider', () => {
        expect(maskLead(rawWithPii).claimed).toBe(false);
        expect(maskLead({ ...rawWithPii, assignedProviderId: 'prov_9' }).claimed).toBe(true);
    });
    it('truncates long descriptions to 200 chars + ellipsis', () => {
        const long = 'x'.repeat(250);
        const masked = maskLead({ ...rawWithPii, description: long });
        expect(masked.description).toHaveLength(201);
        expect(masked.description.endsWith('…')).toBe(true);
    });
});
//# sourceMappingURL=leadMasking.test.js.map