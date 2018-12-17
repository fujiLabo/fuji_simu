Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get '/' => 'home#top'
  get '/main' => 'home#main'
  get '/temp' => 'home#temp'
  post '/home/create' => 'home#create'

  #post '/vendor/json'
end
