# 🎯 Company Blog System - Complete Documentation

## 📋 Overview

A comprehensive company blog system that allows recruiters to create, manage, and showcase their company's stories, achievements, events, and culture. Candidates and visitors can browse and read company stories.

---

## ✨ Features

### For Recruiters
- ✅ Create blog posts with rich content
- ✅ Edit and update existing blogs
- ✅ Delete blog posts
- ✅ Save as draft or publish immediately
- ✅ Categorize blogs (Events, Achievements, Growth, Culture, News)
- ✅ Add cover images
- ✅ Track views and likes
- ✅ Filter and search blogs
- ✅ Statistics dashboard

### For Candidates & Visitors
- ✅ Browse all published company blogs
- ✅ Filter by category
- ✅ Search blogs by title/description
- ✅ View featured blog
- ✅ Read full blog details
- ✅ Like blogs
- ✅ View company information

---

## 🗂️ File Structure

```
client/src/
├── pages/
│   ├── recruiter/
│   │   └── blogs/
│   │       ├── CompanyBlogList.jsx     # Recruiter blog management
│   │       ├── CreateBlog.jsx          # Create new blog
│   │       └── EditBlog.jsx            # Edit existing blog
│   └── common/
│       └── blogs/
│           ├── EnhancedBlogList.jsx    # Public blog listing
│           ├── BlogDetails.jsx         # Blog detail view
│           ├── BlogList.jsx            # Legacy blog list
│           └── BlogsCards.jsx          # Blog card component
│
server/
├── models/
│   └── Blog.js                         # Blog MongoDB schema
└── routes/
    └── blogRoutes.js                   # Blog API endpoints
```

---

## 🛠️ Backend Setup

### 1. Install Required Packages (if not already installed)

```bash
cd server
npm install mongoose express
```

### 2. Import Blog Routes in server.js

```javascript
// server/server.js or app.js
const blogRoutes = require('./routes/blogRoutes');

// Add this line with other routes
app.use('/api/blogs', blogRoutes);
```

### 3. Database Schema

The Blog model includes:

```javascript
{
  title: String (required, max 200 chars)
  description: String (required, max 500 chars)
  content: String (required)
  category: Enum ['event', 'achievement', 'growth', 'culture', 'news']
  image: String (URL)
  status: Enum ['draft', 'published']
  companyId: ObjectId (ref: Company)
  authorId: ObjectId (ref: User)
  views: Number
  likes: Number
  likedBy: [ObjectId]
  timestamps: true
}
```

---

## 🔌 API Endpoints

### Public Endpoints

#### Get All Published Blogs
```http
GET /api/blogs
Query Params: ?category=event&search=keyword&limit=20&page=1
```

#### Get Single Blog
```http
GET /api/blogs/:id
```

### Protected Endpoints (Requires Authentication)

#### Get Company Blogs
```http
GET /api/blogs/company/:companyId
Headers: Authorization: Bearer <token>
```

#### Create Blog
```http
POST /api/blogs
Headers: Authorization: Bearer <token>
Body: {
  "title": "Blog Title",
  "description": "Short description",
  "content": "Full blog content",
  "category": "event",
  "image": "https://image-url.jpg",
  "status": "published",
  "companyId": "company_id"
}
```

#### Update Blog
```http
PUT /api/blogs/:id
Headers: Authorization: Bearer <token>
Body: { ...updated fields }
```

#### Delete Blog
```http
DELETE /api/blogs/:id
Headers: Authorization: Bearer <token>
```

#### Like/Unlike Blog
```http
POST /api/blogs/:id/like
Headers: Authorization: Bearer <token>
```

---

## 🎨 Blog Categories

| Category | Icon | Description | Use Case |
|----------|------|-------------|----------|
| **Event** | 📅 | Company events, conferences, meetups | Annual tech summit, hackathon, team outing |
| **Achievement** | ⭐ | Awards, milestones, recognitions | Award winning, revenue milestone, certification |
| **Growth** | 📈 | Company expansion, new markets | New office opening, team expansion |
| **Culture** | 👥 | Team activities, work environment | DEI initiatives, team bonding, workplace culture |
| **News** | 🏢 | General updates, announcements | Product launch, partnership, company update |

---

## 🚀 Frontend Routes

### Recruiter Routes
```javascript
/recruiter/blogs              → List all company blogs (manage)
/recruiter/blogs/create       → Create new blog post
/recruiter/blogs/edit/:blogId → Edit existing blog
```

### Public Routes
```javascript
/blogs                → Browse all published blogs
/company-stories      → Alternate URL for blogs
/blogs/:id            → View blog details
```

---

## 💻 Usage Examples

### For Recruiters

#### Creating a Blog Post

1. Navigate to `/recruiter/blogs`
2. Click **"Create Blog Post"** button
3. Fill in:
   - Title
   - Short description
   - Select category
   - Add cover image URL (optional)
   - Write full content
4. Choose action:
   - **Save Draft** - Save without publishing
   - **Publish** - Make it live immediately

#### Managing Blogs

- **View** - See how it looks to public
- **Edit** - Update content, status, or category
- **Delete** - Remove blog permanently
- **Filter** - By category or search
- **Stats** - View total posts, published, drafts

### For Candidates

#### Browsing Company Stories

1. Navigate to `/blogs` or `/company-stories`
2. Use search bar to find specific topics
3. Filter by category (Events, Achievements, etc.)
4. Click **category pills** for quick filtering
5. Click any blog card to read full story
6. Like blogs you enjoy

---

## 🎨 UI Components

### CompanyBlogList (Recruiter)

**Features:**
- Grid layout with blog cards
- Search and filter functionality
- Statistics cards (Total, Published, Drafts, This Month)
- Quick actions (View, Edit, Delete)
- Status badges (Published/Draft)
- Category tags with icons

### EnhancedBlogList (Public)

**Features:**
- Hero section with gradient
- Featured blog spotlight
- Category filter pills
- Search functionality
- Company branding on each card
- View count display
- Responsive grid layout

### CreateBlog / EditBlog

**Features:**
- Clean form layout
- Category selection with visual cards
- Image preview
- Character counters
- Tips section
- Dual action buttons (Save Draft / Publish)

---

## 🔐 Security

### Authentication
- All write operations require authentication
- Only blog authors can edit/delete their posts
- Read operations are public for published blogs

### Validation
- Title: Required, max 200 characters
- Description: Required, max 500 characters
- Content: Required
- Category: Must be valid enum value
- Status: Must be 'draft' or 'published'

---

## 📱 Responsive Design

- ✅ Mobile-friendly cards
- ✅ Responsive grid (1 col on mobile, 2 on tablet, 3 on desktop)
- ✅ Touch-optimized buttons
- ✅ Readable typography
- ✅ Optimized images

---

## 🎯 Best Practices for Blog Content

### Writing Tips

1. **Catchy Titles**
   - Use numbers ("5 Ways We...")
   - Create curiosity
   - Be specific

2. **Engaging Descriptions**
   - Keep it under 200 characters
   - Highlight key takeaway
   - Use action words

3. **Rich Content**
   - Tell a story
   - Include specific details
   - Add measurable results
   - Use bullet points for lists
   - Break into sections

4. **Visual Appeal**
   - Use high-quality cover images
   - Relevant to content
   - Consistent branding

### Example Blog Posts

#### Event Blog
```
Title: "Annual Tech Summit 2024 - 1000+ Attendees!"
Category: Event
Description: "Highlights from our biggest tech event featuring industry leaders and breakthrough innovations."
Content: Detailed event recap, key speakers, major announcements, attendee feedback, photos...
```

#### Achievement Blog
```
Title: "We're Now a Certified Great Place to Work!"
Category: Achievement
Description: "Proud to receive the Great Place to Work certification, recognizing our commitment to employee satisfaction."
Content: Journey to certification, what it means, employee testimonials, workplace initiatives...
```

#### Growth Blog
```
Title: "Expanding to 5 New Cities Across India"
Category: Growth
Description: "Our growth story continues as we open offices in Bangalore, Pune, Hyderabad, Chennai, and Kolkata."
Content: Expansion strategy, new opportunities, local impact, hiring plans...
```

---

## 🧪 Testing Checklist

### Recruiter Flow
- [ ] Create new blog (draft)
- [ ] Create and publish blog
- [ ] Edit draft blog
- [ ] Edit published blog
- [ ] Delete blog
- [ ] Search blogs
- [ ] Filter by category
- [ ] View statistics
- [ ] Image upload/preview
- [ ] Character counters work

### Public Flow
- [ ] Browse all blogs
- [ ] Filter by category
- [ ] Search functionality
- [ ] View featured blog
- [ ] Read full blog
- [ ] Like/unlike blog
- [ ] View company info
- [ ] Mobile responsiveness
- [ ] Page navigation

### API Testing
- [ ] GET /api/blogs
- [ ] GET /api/blogs/:id
- [ ] GET /api/blogs/company/:companyId
- [ ] POST /api/blogs
- [ ] PUT /api/blogs/:id
- [ ] DELETE /api/blogs/:id
- [ ] POST /api/blogs/:id/like

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Blogs not loading**
- Check API endpoint is registered in server
- Verify database connection
- Check network tab for errors

**Issue: Can't create blog**
- Ensure user is authenticated
- Check companyId is provided
- Verify all required fields

**Issue: Images not displaying**
- Use valid image URLs (https://)
- Check image URL accessibility
- Verify image format (jpg, png, webp)

**Issue: Cannot edit blog**
- Verify user is the author
- Check authentication token
- Ensure blogId is correct

---

## 📊 Analytics & Metrics

### Track These Metrics

1. **Engagement**
   - Total views per blog
   - Likes count
   - Read time (if implemented)

2. **Content Performance**
   - Most viewed blogs
   - Most liked blogs
   - Popular categories

3. **Publishing Activity**
   - Blogs per month
   - Draft vs Published ratio
   - Active categories

---

## 🚀 Future Enhancements

### Phase 2 Features
- [ ] Comments system
- [ ] Share to social media
- [ ] Related blogs suggestions
- [ ] Rich text editor (WYSIWYG)
- [ ] Multiple image upload
- [ ] Video embeds
- [ ] Tags system
- [ ] SEO optimization
- [ ] Email notifications for new blogs
- [ ] Blog analytics dashboard

### Phase 3 Features
- [ ] Multiple authors per blog
- [ ] Blog series/collections
- [ ] Scheduled publishing
- [ ] Version history
- [ ] Blog templates
- [ ] AI-powered content suggestions
- [ ] Translation support

---

## 📚 Additional Resources

### Design Inspiration
- [Medium](https://medium.com) - Clean blog layout
- [Dev.to](https://dev.to) - Developer blog platform
- [Hashnode](https://hashnode.com) - Technical blog platform

### Content Writing
- [Hemingway Editor](http://www.hemingwayapp.com/) - Improve readability
- [Grammarly](https://www.grammarly.com/) - Grammar checking
- [Canva](https://www.canva.com/) - Create blog graphics

### Image Resources
- [Unsplash](https://unsplash.com) - Free high-quality images
- [Pexels](https://www.pexels.com) - Free stock photos
- [Pixabay](https://pixabay.com) - Free images and videos

---

## 🎉 Success Metrics

### KPIs to Track

1. **Content Creation**
   - Target: 2-4 blogs per month per company
   - Measure: Monthly blog count

2. **Engagement**
   - Target: 100+ views per blog
   - Measure: Average views

3. **Quality**
   - Target: 80% published (not drafts)
   - Measure: Published/Draft ratio

4. **Variety**
   - Target: All 5 categories used
   - Measure: Category distribution

---

## 📞 Support

For questions or issues:
- Create an issue on GitHub
- Contact: [your-email@example.com]
- Documentation: This file

---

## ✅ Conclusion

The Company Blog System is now fully integrated and ready to use! It provides a comprehensive platform for companies to share their stories, achievements, and culture with potential candidates and the wider community.

**Key Benefits:**
- ✅ Showcase company culture and values
- ✅ Attract quality candidates
- ✅ Build employer brand
- ✅ Share success stories
- ✅ Increase company visibility
- ✅ Engage with community

**Start using it today!** 🚀

---

*Last Updated: December 30, 2024*
*Version: 1.0.0*