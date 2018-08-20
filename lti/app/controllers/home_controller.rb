class HomeController < ApplicationController
  def top

  end

  def temp
  end

  def create
    #x-frameでの表示をすべてに許可する
    response.headers['X-Frame-Options'] = 'ALLOWALL'

    #postで送られてきた値のシンボルを指定し@tempに代入
    @temp = params[:lti_message_type]
  end

end
