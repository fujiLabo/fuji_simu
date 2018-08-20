Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  #getページ
  get "/home/top" => "home#top"
  get "/home/temp" => "home#temp"

  #lti環境練習の際に接続するpostページ
  post "/home/create" => "home#create"
end
