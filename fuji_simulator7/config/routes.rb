Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  get '/' => 'home#top'
  get '/temp' => 'home#temp'
  post '/main' => 'home#main'

  post 'net_check' => 'home#net_check'
end
