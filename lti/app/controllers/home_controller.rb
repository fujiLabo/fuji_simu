require 'oauth'
class HomeController < ApplicationController

  def top

  end

  def temp
  end

  def create
  consumer = OAuth::Consumer.new(
    'SOME CONSUMER KEY', 'SOME CONSUMER SECRET',
    :site => 'http://api.example.com'
  )

    #x-frameでの表示をすべてに許可する
    response.headers['X-Frame-Options'] = 'ALLOWALL'

    #postで送られてきた値のシンボルを指定し@tempに代入
    @temp = params[:lti_message_type]
    @oauth_consumer_key = params[:oauth_consumer_key]
  end

end
