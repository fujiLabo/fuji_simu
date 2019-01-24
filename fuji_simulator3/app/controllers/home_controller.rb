class HomeController < ApplicationController

  #require 'json'

  def top
    response.headers['X-Frame-Options'] = 'ALLOWALL'
  end

  def main
    response.headers['X-Frame-Options'] = 'ALLOWALL'
  end

  def temp
    response.headers['X-Frame-Options'] = 'ALLOWALL'
  end

  def net_check
    response.headers['X-Frame-Options'] = 'ALLOWALL'

    hash = params.require(:postJsonData)
  end
end
