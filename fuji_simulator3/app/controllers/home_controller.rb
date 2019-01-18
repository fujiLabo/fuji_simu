class HomeController < ApplicationController

  require 'json'

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

  def net_check
    response.headers['X-Frame-Options'] = 'ALLOWALL'

    #net_check
    #File.open("../study/test.json") do |file|
    #hash = JSON.load(file)


    hash = params.require(:postJsonData)
    printf hash
     #printf hash["total_node_num"]
      seg = hash["total_seg_num"]
      #printf seg
      router = 0
      flag = 0
      #printf hash["seg1"][0]["seg"]+"\n"
      #p hash["seg1"][1]["type"]
      #str = "#{hash["seg1"][0]["seg"]}"
      #printf str+"\n"
      submask = 0
      subbit = 16777216
      #sub = hash["seg1"][0]["seg"]
      sub = hash['seg1']['seg']
      ary = sub.split(".")
      ary.each{|s|
        submask = submask + s.to_i * subbit
        subbit = subbit/256
      }
    #p submask.to_s(2)

      for x in 1..seg do
       # puts x
        num = x.to_s
        node = hash["seg"+num][0]["node_num"]
        ipadd = Array.new() #正確にはネットワークアドレスを入れる配列
        ip4 = Array.new() #ホスト部のアドレスを入れる配列
        #printf hash["seg"+num][0]["seg"]+"\n"
        i = 0
        for y in 1..node do
          ip =  hash["seg"+num][y]["IP"]+"\n" #IPアドレスを取り出し
          if(hash["seg"+num][y]["type"] == 1)
            router += 1
          end
          ary = ip.split(".")
          bit = 16777216
          adb = 0
          ip4.push(ary[3])
          ary.each{|s|
            adb = adb + s.to_i * bit
            bit = bit/256
          }

          adb = adb & submask
          ipadd.push(adb)
         # p adb.to_s(2)
          #p ipadd[i]
          #i += 1
        end
     #ホストに同じ値が入ってたらエラー返す
        for a in 0..seg-2 do
          for b in a+1..seg-1 do
            if(ip4[a]==ip4[b])
              flag += 1
              puts "Error!"
              puts a
              puts b
            end
          end
        end

    #異なるネットワークアドレスが入ってたらエラー返す
        for a in 0..seg-2 do
          for b in a+1..seg-1 do
            if(adb[a]!=adb[b])
              puts "Error!"
              flag += 1
            end
          end
        end
      end

      if(flag == 0)
        puts true
      else
        puts false
      end
       #ルータの判定
      router = router/2
      #p router
  end
end
