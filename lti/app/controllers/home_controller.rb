require 'oauth'
require 'uri'
require "addressable/uri"
require 'cgi'
class HomeController < ApplicationController

  def top

  end

  def temp
  end

  def create
    #x-frameでの表示をすべてに許可する
    response.headers['X-Frame-Options'] = 'ALLOWALL'

    #postで送られてきた値のシンボルを指定し@tempに代入
    #@temp = params.permit!.to_hash
    @temp = params
    #戻り値が文字列だった
    @temp.delete(:action)
    @temp.delete(:controller)
    @temp.delete(:oauth_signature)
    #ハッシュかする
    @temp = @temp.permit!.to_hash
    #ソートする このとき配列になる
    @sort = @temp.sort

    #ソート済みハッシュへ
    @sortHash = Hash[*@sort.flatten]

    puts URI.encode_www_form(@sortHash)


  #@string = @sort[0][0] + "=" + @sort[0][1]

    #@sort[1..-1].each{ |keyvalue|
    #  @string += "&" + keyvalue[0] + "=" + keyvalue[1]
    #}
    #@string.gsub!(' ','+')




    #URI.encode_www_form()
    #puts @string
    #@new = Addressable::URI.parse(@string)
    #@new = URI.parse(@string)
    #puts @new




  end


end
