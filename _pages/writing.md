---
layout: default
title: Writing
permalink: /writing
---

# Writing

<ul class="list-plain tabular-nums">
  {% for post in site.posts %}
    <li><a href="{{ post.url }}" class="internal-link plain"><flex class="align-baseline"><span class="muted ppr flex-shrink small mh nowrap font-ui">{{ post.date | date: "%Y · %m" }}</span> <u>{{ post.title }}</u></flex></a></li>
  {% endfor %}
</ul>
