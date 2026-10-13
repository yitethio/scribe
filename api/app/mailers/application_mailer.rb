class ApplicationMailer < ActionMailer::Base
  default from: ENV.fetch("MAILER_FROM", "Scribe <no-reply@scribe.test>")
  layout "mailer"
end
