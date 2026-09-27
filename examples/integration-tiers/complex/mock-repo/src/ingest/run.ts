/** Mock catalog-sync-v3 §4 — async worker owns normalize + Kafka */
export async function startIngestRun(tenantId: string): Promise<{ jobId: string }> {
  void tenantId;
  return { jobId: "ingest_mock_501" };
}
