-- CreateIndex
CREATE INDEX "ProviderFee_providerId_status_idx" ON "ProviderFee"("providerId", "status");

-- CreateIndex
CREATE INDEX "ProviderFee_status_disputedAt_idx" ON "ProviderFee"("status", "disputedAt");
