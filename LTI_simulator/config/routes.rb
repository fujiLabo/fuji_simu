Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get "/home/top" => "home#top"
  post "/home/create" => "home#create"
  get "/home/temp" => "home#temp"
  get "/home/tstamp" => "home#tstamp"
  get "/home/error" => "home#error"
end
