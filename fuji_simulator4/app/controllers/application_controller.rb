class ApplicationController < ActionController::Base
  #これないと動かない
  protect_from_forgery :except => ["main"]
  protect_from_forgery :except => ["check"]
end
