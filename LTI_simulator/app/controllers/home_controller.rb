require 'oauth'
require 'uri'
require "addressable/uri"
require 'cgi'
require 'digest/hmac'
require 'digest/sha1'
require 'date'
#POSTリクエスト
require 'net/http'
require "rexml/document"

class HomeController < ApplicationController

  def top

  end

  def tstamp

  end

  def error

  end

  def create
    #timestampを取得して格納
    @timestamp = Time.now.to_i.to_s
    @METHOD = "POST"
    #@KEY = params[:oauth_consumer_key] + "&"
    @Nonce = params[:oauth_nonce]
    @KEY = "849bbc901a95ccadda68279d41b08085&"
    @REQUEST = CGI.escape("http://localhost:3000/home/create")
    @SourcedId = params[:lis_result_sourcedid]
    #x-frameでの表示をすべてに許可する
    response.headers['X-Frame-Options'] = 'ALLOWALL'

    #postで送られてきた値のシンボルを指定し@tempに代入
    #@temp = params.permit!.to_hash
    @temp = params
    #戻り値が文字列だった
    @temp.delete(:action)
    @temp.delete(:controller)
    @temp.delete(:oauth_signature)

    #Ruturn_urlをurlエンコードする前に格納
    @Return_url = @temp[:launch_presentation_return_url]
    #成績を返すurlを格納
    @Return_grade = @temp[:lis_outcome_service_url]

    unless @Return_url == params[:launch_presentation_return_url]
      redirect_to  action:"error"

    end


    #timestampcheck
    if @timestamp == @temp[:oauth_timestamp].to_s then
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

    #puts @string
    @Signature_base_string = @METHOD
    @Signature_base_string += "&" + @REQUEST
    @Signature_base_string += "&" + CGI.escape(@string)

    @Digest = OpenSSL::Digest::SHA1.new
    #puts @Signature_base_string
    #puts Base64.encode64(OpenSSL::HMAC::digest(OpenSSL::Digest::SHA1.new,@KEY,@Signature_base_string))

    #signatureの作成および最後の入る\nをchopで消している
    @oauth_signature = Base64.encode64(OpenSSL::HMAC::digest(@Digest,@KEY,@Signature_base_string)).chop
    puts Base64.encode64(OpenSSL::HMAC::digest(@Digest,@KEY,@Signature_base_string))
    #puts OpenSSL::HMAC::digest(OpenSSL::Digest::SHA1.new,@KEY,@Signature_base_strin
    #puts @KEY
    #puts @timestamp

    #@query = CGI.escape("Most things in here don't react well to bullets.")
    #@query.gsub!('+','%20')
    #@query.gsub!('.','%2e')



#=begin
#####POST送信関係の処理

#test
t = File.open('aa.txt','r')
s = t.read
@Oauth_strings = s.chomp
t.close

=begin
@Oauth_strings = "OAuth realm" + "=" + "\"http://sp.example.com/\"" + "," +
                 "oauth_consumer_key" + "=" + "\"" + @KEY + "\"" + "," +
                 "oauth_signature_method" + "=" + "\"HMAC-SHA1\"" + "," +
                 "oauth_timestamp" + "=" + "\"" + @timestamp + "\"" + "," +
                 "oauth_nonce" + "=" + "\"" + @Nonce + "\"" + "," +
                 "oauth_version" + "=" + "\"" + "1.0" + "\"" "," +
                 "oauth_signature" + "=" + "\"" + @oauth_signature + "\""
=end


  @uri = URI.parse(@Return_grade)

=begin
  header = {'Content-Type': 'application/xml',
    'Authorization': @Oauth_strings
  }
=end

  @File_read_Xml = File.open("aa.xml", "r")


#OAuth_hashを作るぞ〜〜〜〜


  doc = REXML::Document.new(@File_read_Xml)
  element = doc.elements['imsx_POXEnvelopeRequest/imsx_POXBody/replaceResultRequest/resultRecord/sourcedGUID/sourcedId']
  element.text = nil
  element.add_text(@SourcedId)
  #puts doc.to_s
#=begin
  #create the http object
  http = Net::HTTP.new(@uri.host, @uri.port)
  http.use_ssl = true
  request = Net::HTTP::Post.new(@uri.request_uri)
  request["Content-Type"] = "application/xml"
  request["Authorization"] = @Oauth_strings
  request.body = doc.to_s
#=end

=begin
#test
http = Net::HTTP.new("133.14.14.232", 80)
http.use_ssl = false
request = Net::HTTP::Post.new("http://133.14.14.232")
request["Content-Type"] = "application/xml"
request["Authorization"] = @Oauth_strings
request.body = doc.to_s

=end

  #send the request
  response = http.request(request)

  #puts @Oauth_strings

#=end

  end

end
