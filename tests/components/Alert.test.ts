import { Alert } from "../../src/components/Alert";
import { MessageBuilder } from "../../src/teleprinter";

describe("Alert", () => {
  describe("function version", () => {
    it("should create info alert with basic message", () => {
      const result = Alert("info", "Test message").render();
      expect(result).toContain("💬");
      expect(result).toContain("INFO");
      expect(result).toContain("Test message");
    });

    it("should create alert with all options", () => {
      const result = Alert("warning", "Important message", {
        group: "security",
        usernames: ["admin", "@devops"],
        timestamp: new Date("2024-03-20T12:00:00Z"),
      }).render();

      expect(result).toContain("⚠️");
      expect(result).toContain("WARNING");
      expect(result).toContain("Important message");
      expect(result).toContain("[SECURITY]");
      expect(result).toContain("@admin, @devops");
      expect(result).toContain("2024-03-20T12:00:00.000Z");
    });

    it("should work with MessageBuilder", () => {
      const result = MessageBuilder()
        .row(({ Alert }) =>
          Alert("info", "Disk usage exceeded 90%", {
            group: "infra",
            usernames: ["devops", "@admin"],
            timestamp: new Date("2024-03-20T12:00:00Z"),
          })
        )
        .render();

      expect(result).toContain("💬");
      expect(result).toContain("INFO");
      expect(result).toContain("Disk usage exceeded 90%");
      expect(result).toContain("[INFRA]");
      expect(result).toContain("@devops, @admin");
      expect(result).toContain("2024-03-20T12:00:00.000Z");
    });

    it("should work with multiple rows in MessageBuilder", () => {
      const result = MessageBuilder()
        .row("Start of alert")
        .row(({ Alert }) =>
          Alert("warning", "High CPU usage", {
            group: "monitoring",
          })
        )
        .row(({ Alert }) =>
          Alert("error", "Service down", {
            usernames: ["@ops", "admin"],
          })
        )
        .row("End of alert")
        .render();

      const expected = [
        "Start of alert",
        "⚠️ <b>WARNING</b> ([MONITORING])",
        "High CPU usage",
        "❌ <b>ERROR</b> (@ops, @admin)",
        "Service down",
        "End of alert",
      ].join("\n");
      expect(result).toContain(expected);
    });

    it("should work with combination of text and components", () => {
      const result = MessageBuilder()
        .row(
          "start the alert",
          ({ Alert }) =>
            Alert("warning", "High CPU usage", {
              group: "monitoring",
            }),
          "end the alert"
        )
        .render();

      const expected =
        "start the alert ⚠️ <b>WARNING</b> ([MONITORING])\nHigh CPU usage\n end the alert";
      expect(result).toContain(expected);
    });
  });

  describe("text version", () => {
    it("should create info alert with basic message", () => {
      const result = Alert("info", "Test message").render();
      expect(result).toContain("💬");
      expect(result).toContain("INFO");
      expect(result).toContain("Test message");
    });

    it("should create an info alert", () => {
      const result = Alert("info", "This is an info message").render();
      expect(result).toContain("💬 <b>INFO</b>");
      expect(result).toContain("This is an info message");
    });

    it("should create a success alert", () => {
      const result = Alert("success", "Operation successful").render();
      expect(result).toContain("✅ <b>SUCCESS</b>");
      expect(result).toContain("Operation successful");
    });

    it("should create a warning alert", () => {
      const result = Alert("warning", "Be careful").render();
      expect(result).toContain("⚠️ <b>WARNING</b>");
      expect(result).toContain("Be careful");
    });

    it("should create an error alert", () => {
      const result = Alert("error", "Something went wrong").render();
      expect(result).toContain("❌ <b>ERROR</b>");
      expect(result).toContain("Something went wrong");
    });

    it("should create an alert with group", () => {
      const result = Alert("info", "Group message", { group: "TEST" }).render();
      expect(result).toContain("💬 <b>INFO</b> ([TEST])");
      expect(result).toContain("Group message");
    });

    it("should create an alert with usernames", () => {
      const result = Alert("warning", "Attention needed", {
        usernames: ["user1", "@user2"],
      }).render();
      expect(result).toContain("⚠️ <b>WARNING</b> (@user1, @user2)");
      expect(result).toContain("Attention needed");
    });

    it("should create an alert with timestamp", () => {
      const timestamp = new Date("2024-03-21T10:30:00Z");
      const result = Alert("success", "Completed", { timestamp }).render();
      expect(result).toContain("✅ <b>SUCCESS</b> (2024-03-21T10:30:00.000Z)");
      expect(result).toContain("Completed");
    });

    it("should create an alert with all metadata", () => {
      const timestamp = new Date("2024-03-21T10:30:00Z");
      const result = Alert("error", "System failure", {
        group: "SYSTEM",
        usernames: ["admin"],
        timestamp,
      }).render();
      expect(result).toContain(
        "❌ <b>ERROR</b> ([SYSTEM] • @admin • 2024-03-21T10:30:00.000Z)"
      );
      expect(result).toContain("System failure");
    });

    it("should handle empty usernames array", () => {
      const result = Alert("info", "Empty usernames", {
        usernames: [],
      }).render();
      expect(result).toContain("💬 <b>INFO</b>");
      expect(result).toContain("Empty usernames");
    });

    it("should handle string timestamp", () => {
      const result = Alert("warning", "String timestamp", {
        timestamp: "2024-03-21T10:30:00Z",
      }).render();
      expect(result).toContain("⚠️ <b>WARNING</b> (2024-03-21T10:30:00.000Z)");
      expect(result).toContain("String timestamp");
    });

    it("should handle multiline message", () => {
      const result = Alert("error", "Line 1\nLine 2\nLine 3").render();
      expect(result).toContain("❌ <b>ERROR</b>");
      expect(result).toContain("Line 1\nLine 2\nLine 3");
    });

    it("should handle special characters in group name", () => {
      const result = Alert("info", "Special chars", {
        group: "TEST-GROUP_123",
      }).render();
      expect(result).toContain("💬 <b>INFO</b> ([TEST-GROUP_123])");
      expect(result).toContain("Special chars");
    });

    it("should handle empty message", () => {
      const result = Alert("warning", "").render();
      expect(result).toContain("⚠️ <b>WARNING</b>");
      expect(result).toContain("");
    });
  });

  describe("Real world example", () => {
    it("should create info alert with basic message", () => {
      const result = MessageBuilder()
        .row(({ Alert }) =>
          Alert("info", "Disk usage exceeded 90%", {
            group: "infra",
            usernames: ["devops", "@admin"],
            timestamp: new Date("2024-03-20T12:00:00Z"),
          })
        )
        .render();

      const expected =
        "💬 <b>INFO</b> ([INFRA] • @devops, @admin • 2024-03-20T12:00:00.000Z)\nDisk usage exceeded 90%";
      expect(result).toContain(expected);
    });

    it("should create info alert with all options", () => {
      const timestamp = new Date("2024-03-20T12:00:00Z");
      const result = MessageBuilder()
        .row("📅 Release Reminder")
        .row(({ Alert }) =>
          Alert(
            "info",
            "ℹ️ `v1.12.0` scheduled for release tomorrow at 10:00 AM UTC",
            {
              usernames: ["@frontend", "@backend"],
              group: "release",
              timestamp,
            }
          )
        )
        .row("Finalize changelogs and verify environments.")
        .render();

      const expected =
        "📅 Release Reminder\n💬 <b>INFO</b> ([RELEASE] • @frontend, @backend • 2024-03-20T12:00:00.000Z)\nℹ️ `v1.12.0` scheduled for release tomorrow at 10:00 AM UTC\nFinalize changelogs and verify environments.";
      expect(result).toContain(expected);
    });
  });

  it("should create error alert with all options", () => {
    const timestamp = new Date("2024-03-20T12:00:00Z");
    const result = MessageBuilder()
      .row("🛠️ CI/CD Alert")
      .row(({ Alert }) =>
        Alert("error", "Build failed for commit `abc1234` in `main` branch", {
          usernames: ["@dev1", "devops"],
          group: "ci-cd",
          timestamp,
        })
      )
      .row("Check GitHub Actions logs.")
      .render();

    const expected =
      "🛠️ CI/CD Alert\n❌ <b>ERROR</b> ([CI-CD] • @dev1, @devops • 2024-03-20T12:00:00.000Z)\nBuild failed for commit `abc1234` in `main` branch\nCheck GitHub Actions logs.";
    expect(result).toContain(expected);
  });

  it("should create warning alert with all options", () => {
    const timestamp = new Date("2024-03-20T12:00:00Z");
    const result = MessageBuilder()
      .row("🧪 CI Warning")
      .row(({ Alert }) =>
        Alert(
          "warning",
          "⚠️ Unit test coverage dropped below 80% in `checkout-service`",
          {
            usernames: ["@team-lead"],
            group: "ci",
            timestamp,
          }
        )
      )
      .row("Consider adding more tests before merging.")
      .render();

    const expected =
      "🧪 CI Warning\n⚠️ <b>WARNING</b> ([CI] • @team-lead • 2024-03-20T12:00:00.000Z)\n⚠️ Unit test coverage dropped below 80% in `checkout-service`\nConsider adding more tests before merging.";
    expect(result).toContain(expected);
  });

  it("should create success alert with all options", () => {
    const timestamp = new Date("2024-03-20T12:00:00Z");
    const result = MessageBuilder()
      .row("🚀 Deployment Notification")
      .row(({ Alert }) =>
        Alert(
          "success",
          "✅ New version `v2.3.1` of `payments-service` deployed to production",
          {
            usernames: ["@backend", "@qa"],
            group: "ci-cd",
            timestamp,
          }
        )
      )
      .row("No errors detected in health checks.")
      .render();

    const expected =
      "🚀 Deployment Notification\n✅ <b>SUCCESS</b> ([CI-CD] • @backend, @qa • 2024-03-20T12:00:00.000Z)\n✅ New version `v2.3.1` of `payments-service` deployed to production\nNo errors detected in health checks.";
    expect(result).toContain(expected);
  });

  it("should create error alert with all options", () => {
    const timestamp = new Date("2024-03-20T12:00:00Z");
    const result = MessageBuilder()
      .row("🚨 High Priority Alert")
      .row(({ Alert }) =>
        Alert("error", "❌ Service `auth-api` is returning 5xx errors", {
          usernames: ["@oncall", "devops"],
          group: "auth",
          timestamp,
        })
      )
      .row("Check logs and roll back if needed.")
      .render();

    const expected =
      "🚨 High Priority Alert\n❌ <b>ERROR</b> ([AUTH] • @oncall, @devops • 2024-03-20T12:00:00.000Z)\n❌ Service `auth-api` is returning 5xx errors\nCheck logs and roll back if needed.";
    expect(result).toContain(expected);
  });
});
