# %w[rubygems sinatra haml data_mapper].each{ |gem| require gem }

require 'rubygems'
require 'sinatra'
require 'data_mapper'
require 'Haml'

DataMapper.setup(:default, ENV['DATABASE_URL'] || "sqlite3://#{Dir.pwd}/demo.db")
# Class DB
class Notice
	include DataMapper::Resource

	property :id,          Serial
	property :title,       String
	property :description, Text
	property :created_at,  String
	property :img,         String

	def link
    	"<a href=\"view/#{self.id}\" class='more'>Read More</a>"   
  	end
end
# Helpers	
helpers do
	def get_notices(name_class, per_page, page)
		
		if page.to_i == 0
			page = 1
		end
		offset = (page.to_i - 1) * 3
		@pagination = name_class.all(:limit => per_page,:offset => offset, :order => :id.desc)
		g_number = name_class.all.size
		
		# get link's number
		num_pages = g_number / per_page
		rest = g_number % per_page
		unless rest == 0
			num_pages = num_pages + 1
		end

		i = 1
		links =""

		while i <= num_pages
			links = links +  "<a href=\"#{i}\">#{i}</a> "
			i = i + 1
		end

		return links
	end
	def sript_html(str)
		all_str = str.gsub(/<\/?[^>]*>/, "")
		split_str = all_str[0,200]

		return split_str
	end
end

# index
get '/' do
	haml :index
end
# Notice 1..9
get %r{/notice/([\d]+)} do |num|
	@num = num
	@mini_nav = get_notices(Notice, 3 ,num)
	haml :'notices/index' # ,:locals => {:path => ": Inicio / "}
end
# Notice view
get '/notice/view/:id' do
	@notice = Notice.get(params[:id])
	haml :'notices/notice'
end
# Notice new
get '/notice/new' do
	haml :'notices/new'
end
# Notice create
post '/notice/create' do
	path_img = ""

	unless params[:file] &&	(tmpfile = params[:file][:tempfile]) &&	(name = params[:file][:filename])
		@error = "No file selected"
		return haml(:upload)
	end
		directory = "./public/uploads/"
		path = File.join(directory, name)
		File.open(path, "wb") { |f| f.write(tmpfile.read) }

	notice = Notice.new(:title => params[:title], :description => params[:description], :created_at => Time.now, :img => "/uploads/" + params[:file][:filename] );
	
	if notice.save
		status 201
		redirect '/'  
	else
		status 412
		redirect '/'   
	end
end
# Public Information
get '/profile' do
	haml :'profile/index'
end

get '/profile/response' do
	"Helo world from the server"
end

get '/profile/time' do
	"The time is " + Time.now.to_s 
end

post '/profile/reverse' do
	params[:word]
end

get '/profile/1' do
	@subtitle = 'Presentacion'
	haml :'profile/profile_0', :layout => false
end

get '/profile/2' do
	haml :'profile/profile_1', :layout => false
end

get '/profile/3' do
	haml :'profile/profile_2', :layout => false
end

get '/profile/4' do
	haml :'profile/profile_3', :layout => false
end

# SASS stylesheet
get '/stylesheets/style.css' do
  header 'Content-Type' => 'text/css; charset=utf-8'
  sass :'	stylesheets/style'
end

get '/stylesheets/nice-principal.css' do
  header 'Content-Type' => 'text/css; charset=utf-8'
  sass :'stylesheets/nice-principal'
end
DataMapper.auto_upgrade!
