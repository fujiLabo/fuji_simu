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

  # def net_check
  #   response.headers['X-Frame-Options'] = 'ALLOWALL'
  #

#     #net_check
#     hash = params.require(:postJsonData)
#     printf hash
#
#     #File.open("/NewNetworkSimulator/study/test.json") do |file|
#     #File.open("test.json") do |file|
#       #hash = JSON.load(file)
#       seg = hash["total_seg_num"]
#       total = hash["total_node_num"]
#       router = 0
#       flag = 0
#       node_check = 0
#       submask = 0
#       subbit = 16777216
#       sub = hash["seg1"][0]["seg"]
#       ary = sub.split(".")
#       ary.each{|s|
#         submask = submask + s.to_i * subbit
#         subbit = subbit/256
#       }
#     #p submask.to_s(2)
#       for x in 1..seg do
#         #puts x
#         num = x.to_s
#         node = hash["seg"+num][0]["node_num"]
#         ipadd = Array.new() #正確にはネットワークアドレスを入れる配列
#         ip4 = Array.new() #ホスト部のアドレスを入れる配列
#         i = 0
#         for y in 1..node do
#           node_check += 1
#           ip =  hash["seg"+num][y]["IP"]+"\n" #IPアドレスを取り出し
#           if(hash["seg"+num][y]["type"] == 1)
#             router += 1
#           end
#           ary = ip.split(".")
#           bit = 16777216
#           adb = 0
#           ip4.push(ary[3])
#           ary.each{|s|
#             adb = adb + s.to_i * bit
#             bit = bit/256
#           }
#
#           adb = adb & submask
#           ipadd.push(adb)
#           #p adb.to_s(2)
#           #p ipadd[i]
#           #p i
#           #i += 1
#
#         end
#         #ホストに同じ値が入ってたらエラー返す
#           for a in 0..node-2 do
#             for b in a+1..node-1 do
#               if(ip4[a]==ip4[b])
#                 flag += 1
#                 #puts "Error!"
#                 #puts a
#                 #puts b
#               end
#             end
#           end
#
#     #異なるネットワークアドレスが入ってたらエラー返す
#           for a in 0..node-2 do
#             for b in a+1..node-1 do
#               if(ipadd[a]!=ipadd[b])
#                 #puts "Error!"
#                 flag += 1
#               end
#             end
#           end
#
#       end
#      #p node_check
#
#        #ルータの判定
#       router = router/2
#       #p router
#
#       #p node_check-router
#       if(node_check-router != total)
#         flag += 1
#       end
#       if(flag == 0)
#         puts ("true")
#       else
#       #  p flag
#         puts("false")
#       end
#      system('rm test.json')
#     end

def net_check
end
end
