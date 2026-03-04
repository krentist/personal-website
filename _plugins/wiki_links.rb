module Jekyll
  module WikiLinks
    def convert_wiki_links(content)
      # Get all note titles and their slugs from the current site
      note_slugs = {}
      
      if @context.registers[:site]
        @context.registers[:site].collections['notes'].docs.each do |doc|
          title = doc.data['title'] || doc.basename_without_ext
          slug = doc.basename_without_ext.downcase.gsub(/\s+/, '-')
          note_slugs[title.downcase] = slug
        end
      end

      # Replace [[note name]] with proper links or just text
      content.gsub(/\[\[([^\]]+)\]\]/) do |match|
        link_text = $1.strip
        link_key = link_text.downcase

        if note_slugs[link_key]
          slug = note_slugs[link_key]
          "<a href=\"/#{slug}\" class=\"internal-link\">#{link_text}</a>"
        else
          # If note doesn't exist, just show text without brackets
          link_text
        end
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::WikiLinks)


