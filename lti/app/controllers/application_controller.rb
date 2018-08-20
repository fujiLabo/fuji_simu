class ApplicationController < ActionController::Base
  #CSRF対策を無効にする
  protect_from_forgery :except => ["create"]
end
