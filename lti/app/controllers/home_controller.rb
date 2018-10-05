require 'oauth'
require 'uri'
require "addressable/uri"
class HomeController < ApplicationController

  def top

  end

  def temp
  end

  def create
    #x-frameでの表示をすべてに許可する
    response.headers['X-Frame-Options'] = 'ALLOWALL'

    #postで送られてきた値のシンボルを指定し@tempに代入
    @temp = params.permit!.to_hash
    @sort = @temp.sort
    @oauth_consumer_key = params[:oauth_consumer_key]

  end

end
