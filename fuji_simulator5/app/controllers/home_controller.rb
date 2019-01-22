class HomeController < ApplicationController

  require 'json'

  def top
  end

  def main
  end

  def temp
  end

  def create
  end
  def net_check
    hash = params.require(:postJsonData)
  end
end
