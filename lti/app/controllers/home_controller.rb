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
    response.headers['X-Frame-Options'] = 'ALLOWALL'

  end

  def temp
    response.headers['X-Frame-Options'] = 'ALLOWALL'
  end

  def tstamp

  end

  def error

  end

  def grade_page
    response.headers['X-Frame-Options'] = 'ALLOWALL'

  end

  def create
    #x-frameでの表示をすべてに許可する
    response.headers['X-Frame-Options'] = 'ALLOWALL'


    @SourcedId = params[:lis_result_sourcedid]
    f = File.open("aa.xml", "r")
    @File_read_Xml = f.read
    $doc = REXML::Document.new(@File_read_Xml)
    element = $doc.elements['imsx_POXEnvelopeRequest/imsx_POXBody/replaceResultRequest/resultRecord/sourcedGUID/sourcedId']
    element.text = nil
    element.add_text(@SourcedId)
    #puts doc.to_s

=begin
    #XMLの読み込み
    f = File.open("aa.xml", "r")
    @File_read_Xml = f.read
=end
  puts "aaaaaaaaaaaa!!!"
  puts $doc.to_s
    #Oauth_hash作成
    @Body_hash = CGI.escape(Base64.encode64(Digest::SHA1.digest($doc.to_s)).chomp)

    #timestampを取得して格納
    @timestamp = Time.now.to_i.to_s
    @METHOD = "POST"
    @Oauth_Method = "HMAC-SHA1"
    #@KEY = params[:oauth_consumer_key] + "&"
    @Nonce = params[:oauth_nonce]
    @Oauth_Consumer_key = params[:oauth_consumer_key]
    #@KEY = @Oauth_Consumer_key + "&"
    @KEY = "321"
    #@KEY = "140beed4619fd0cdaff80e163a125eca&"
    #@REQUEST = CGI.escape("http://localhost:3000/home/create")
    @REQUEST = CGI.escape("http://133.14.14.230/mod/lti/service.php")

    #@SourcedId = params[:lis_course_section_sourcedid]

    #postで送られてきた値のシンボルを指定し@tempに代入

#=begin
    ###test###############
        @version = params[:oauth_version]
        @aaa = {oauth_consumer_key:@Oauth_Consumer_key,oauth_nonce:@Nonce,oauth_signature_method:@Oauth_Method,oauth_timestamp:@timestamp,oauth_version:@version,oauth_body_hash:@Body_hash}

        puts "aaaa="
        puts @aaa
        @aaa = @aaa.to_hash

        @aaa.each { |key, value|
          @tempString = value#CGI.escape(value)
          @tempString.gsub!('+','%20')
          @aaa[key] = @tempString
        }
        #ソートする このとき配列になる
        @sort = @aaa.sort

        puts "sort"
        puts @sort

    ########################
#=end


    @temp = params

    #Body_hashの追加
    @temp[:oauth_body_hash] = @Body_hash

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


=begin
    #ハッシュかする
    @temp = @temp.permit!.to_hash

    @temp.each { |key, value|
      @tempString = CGI.escape(value)
      @tempString.gsub!('+','%20')
      @temp[key] = @tempString
    }
    #ソートする このとき配列になる
    @sort = @temp.sort

=end

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
    @string = @sort[0][0].to_s + "=" + @sort[0][1]

    @sort[1..-1].each{ |keyvalue|
      @string += "&" + keyvalue[0].to_s + "=" + keyvalue[1]
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
    Base64.encode64(OpenSSL::HMAC::digest(@Digest,@KEY,@Signature_base_string))
    #puts OpenSSL::HMAC::digest(OpenSSL::Digest::SHA1.new,@KEY,@Signature_base_strin
    #puts @KEY
    #puts @timestamp

    #@query = CGI.escape("Most things in here don't react well to bullets.")
    #@query.gsub!('+','%20')
    #@query.gsub!('.','%2e')



=begin
#####POST送信関係の処理


=end


  $uri = URI.parse(@Return_grade)

  $uri_2 = URI.parse(@Return_url)


  $Oauth_strings ="OAuth realm" + "=" + "\"\"" + "," +
                 "oauth_consumer_key" + "=" + "\"" + @Oauth_Consumer_key + "\"" + "," +
                 "oauth_signature_method" + "=" + "\"HMAC-SHA1\"" + "," +
                 "oauth_timestamp" + "=" + "\"" + @timestamp + "\"" + "," +
                 "oauth_nonce" + "=" + "\"" + @Nonce + "\"" + "," +
                 "oauth_version" + "=" + "\"" + "1.0" + "\"" "," +
                 "oauth_signature" + "=" + "\"" + @oauth_signature + "\"" + "," +
                 "oauth_body_hash" + "=" + "\"" + @Body_hash + "\""


=begin
                   header = {'Content-Type': 'application/xml',
                     'Authorization': $Oauth_strings
                   }
=end


=begin
  $doc = REXML::Document.new(@File_read_Xml)
  element = $doc.elements['imsx_POXEnvelopeRequest/imsx_POXBody/replaceResultRequest/resultRecord/sourcedGUID/sourcedId']
  element.text = nil
  element.add_text(@SourcedId)
  #puts doc.to_s

=end
#=end

#=end

=begin
  #create the http object
  http = Net::HTTP.new(@uri.host, @uri.port)
  http.use_ssl = false
  request = Net::HTTP::Post.new(@uri.request_uri)
  request["Content-Type"] = "application/xml"
  request["Authorization"] = @Oauth_strings
  request.body = doc.to_s
=end


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
  #response = http.request(request)
  #puts @Oauth_strings


  end
  def grade
#=begin
    http = Net::HTTP.new($uri.host, $uri.port)
    http.use_ssl = true
    request = Net::HTTP::Post.new($uri.request_uri)
    request["Content-Type"] = "application/xml"
    request["Authorization"] = $Oauth_strings
    request.body = $doc.to_s

    response = http.request(request)
    $test = response.body

    redirect_to :action => "grade_page"
#=end

=begin
    http = Net::HTTP.new("133.14.14.232", 80)
    http.use_ssl = false
    request = Net::HTTP::Post.new("http://133.14.14.232")
    request["Content-Type"] = "application/xml"
    request["Authorization"] = $Oauth_strings
    request.body = $doc.to_s

    response = http.request(request)
=end
  end

helper_method :grade
end
