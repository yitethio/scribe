class User < ApplicationRecord
  include Progress

  has_secure_password
  has_many :sessions, dependent: :destroy
  has_many :skills, dependent: :destroy
  has_many :vocabulary_words, dependent: :destroy
  has_many :book_sessions, dependent: :destroy
  has_many :drafts, dependent: :destroy
  has_many :coach_issues, through: :drafts
  belongs_to :focused_skill, class_name: "Skill", optional: true

  normalizes :email_address, with: ->(e) { e.strip.downcase }

  validates :name, presence: true
  validates :email_address, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { minimum: 8 }, allow_nil: true
  validates :weekly_goal, numericality: { greater_than: 0 }
end
