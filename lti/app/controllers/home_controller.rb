require 'oauth'
require 'uri'
require "addressable/uri"
require 'cgi'
require 'digest/hmac'
require 'digest/sha1'
require 'date'

class HomeController < ApplicationController

  def top

  end

  def tstamp

  end

  def create
    @METHOD = "POST"
    @KEY = "46621daec7f6e7d3f030032dc3c571c5&"
    @REQUEST = CGI.escape("http://localhost:3000/home/create")

    #x-frameでの表示をすべてに許可する
    response.headers['X-Frame-Options'] = 'ALLOWALL'

    #postで送られてきた値のシンボルを指定し@tempに代入
    #@temp = params.permit!.to_hash
    @temp = params
    #戻り値が文字列だった
    @temp.delete(:action)
    @temp.delete(:controller)
    @temp.delete(:oauth_signature)
    #timestampを取得して格納
    @timestamp = Time.now.to_i
    #Ruturn_urlをurlエンコードする前に格納
    @Return_url = @temp[:launch_presentation_return_url]


    #timestampcheck
    if @timestamp == @temp[:oauth_timestamp].to_i then
      puts "True"

    elsif
      puts "false"
      redirect_to action:"tstamp"
      exit 0;
    end

    #ハッシュかする
    @temp = @temp.permit!.to_hash

    @temp.each { |key, value|
      @tempString = CGI.escape(value)
      @tempString.gsub!('+','%20')
      @temp[key] = @tempString
    }
    #ソートする このとき配列になる
    @sort = @temp.sort

=begin
    @sort.each  { |keyvalue|
      @string += keyvalue
    }
    @string.gsub!(' ','+')

    #ソート済みハッシュへ
    @sortHash = Hash[*@sort.flatten]

    puts URI.encode_www_form(@sortHash)
=end

 #自力でやる方
    @string = @sort[0][0] + "=" + @sort[0][1]

    @sort[1..-1].each{ |keyvalue|
      @string += "&" + keyvalue[0] + "=" + keyvalue[1]
    }

=begin
    @string.gsub!(' ','+')
    @string.gsub!('+','%20')
    @string.gsub!('&','%26')
    @string.gsub!(':','%3A')
    @string.gsub!('/','%2F')
    @string.gsub!('=','%3D')
=end

    #puts @string
    @Signature_base_string = @METHOD
    @Signature_base_string += "&" + @REQUEST
    @Signature_base_string += "&" + CGI.escape(@string)

    @Digest =OpenSSL::Digest::SHA1.new
    #puts @Signature_base_string
    #puts Base64.encode64(OpenSSL::HMAC::digest(OpenSSL::Digest::SHA1.new,@KEY,@Signature_base_string))
    puts Base64.encode64(OpenSSL::HMAC::digest(@Digest,@KEY,@Signature_base_string))
    #puts OpenSSL::HMAC::digest(OpenSSL::Digest::SHA1.new,@KEY,@Signature_base_strin
    puts Time.now.to_i



  end


end
