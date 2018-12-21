class HomeController < ApplicationController
  def top
  end

  def main
    response.headers['X-Frame-Options'] = 'ALLOWALL'
  end

  def temp
  end

  def create
  end
end
