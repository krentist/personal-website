---
layout: home
title: Home
id: home
permalink: /
---

<div class="wrap">

  <p class="muted font-ui"><a href="#" class="muted internal-link">Writing</a></p>

  <ul class="list-plain tabular-nums">
    {% assign posts = site.posts | sort: "date" | reverse %}
    {% for post in posts %}
      <li><a href="{{ post.url }}" class="internal-link plain"><flex class="align-baseline"><span class="muted ppr flex-shrink small mh nowrap font-ui">{{ post.date | date: "%Y · %m" }}</span> <u>{{ post.title }}</u></flex></a></li>
    {% endfor %}
    
    {% assign notes = site.notes | sort: "date" | reverse %}
    {% for note in notes %}
      <li><a href="{{ note.url }}" class="internal-link plain"><flex class="align-baseline"><span class="muted ppr flex-shrink small mh nowrap font-ui">{% if note.date %}{{ note.date | date: "%Y · %m" }}{% else %}—{% endif %}</span> <u>{{ note.title }}</u></flex></a></li>
    {% endfor %}
  </ul>

</div>
