class ApplicationController < ActionController::Base
  #これないと動かない
  protect_from_forgery :except => ["main"]
end
