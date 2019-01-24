class HomeController < ApplicationController

  require 'json'
  require './app/controllers/func.rb'

  def top
    response.headers['X-Frame-Options'] = 'ALLOWALL'
  end

  def main
    response.headers['X-Frame-Options'] = 'ALLOWALL'
  end

  def temp
    response.headers['X-Frame-Options'] = 'ALLOWALL'
  end

  def create
    response.headers['X-Frame-Options'] = 'ALLOWALL'
  end

  def check
    response.headers['X-Frame-Options'] = 'ALLOWALL'

    hash = params.require(:postJsonData)
    hash = JSON.parse(hash)

      p 'ここから'
      p hash
      data = Array.new()
      for a in 0..hash["pc_num"] - 1 do
        for b in 0..hash["pc_num"] - 1 do
          if a!=b
            nusi = hash["nodeInfo"][a]["name"]
            #p nusi
            flag = 0

            #p node_num
              aaa = Array.new()
              #bはゲットの代わり
              if hash["nodeInfo"][a]["ip"]==""||hash["nodeInfo"][a]["sm"]==""
                result = Array.new()
                result<<nusi
                result<<0
              else
                result = find(hash,nusi,b,aaa)
              #p hash["nodeInfo"][b]["name"]
              #p result
              end
              data << result
          end
        end
      end
    render json: data.to_json



  end
end
