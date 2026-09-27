/** Mock: wired on deploy.succeeded — see change-brief.json integration section */
export async function onDeploySucceeded(event: {
  environment: string;
  version: string;
  actor: string;
}): Promise<void> {
  if (event.environment !== "production") return;
  const { postSlackDeploySummary } = await import("../integrations/slack-webhook.js");
  await postSlackDeploySummary(event);
}
