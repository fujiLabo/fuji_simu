class HomeController < ApplicationController
  def top
    response.headers['X-Frame-Options'] = 'ALLOWALL'
  end

  def main
    response.headers['X-Frame-Options'] = 'ALLOWALL'
  end

  def temp
  end

  def net_check
  end
end
