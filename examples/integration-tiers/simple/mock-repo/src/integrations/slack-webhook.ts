export async function postSlackDeploySummary(event: {
  version: string;
  actor: string;
}): Promise<void> {
  const url = process.env.SLACK_DEPLOY_WEBHOOK_URL;
  if (!url) {
    console.warn("SLACK_DEPLOY_WEBHOOK_URL unset; skip notify");
    return;
  }
  await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      text: `Deployed ${event.version} by ${event.actor}`,
    }),
    signal: AbortSignal.timeout(5000),
  });
}
