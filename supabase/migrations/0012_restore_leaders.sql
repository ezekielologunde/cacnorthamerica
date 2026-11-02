-- Restore the CACNA leadership roster lost from cacna.leaders.
--
-- Sources: the recovered old-WordPress leader pages (zone/DCC superintendents,
-- page 1611 "Current Leaders", page 1729 "CAC Current Leaders" and the
-- per-leader profile pages) and, for past leaders, cacworld.org (Presidents,
-- General Superintendents, General Evangelists) plus the old site's Past
-- Leaders page (General Secretaries, General Treasurers). Photos are the
-- old site's uploads, resized into public/images/leaders/.
--
-- Idempotent: every insert is guarded by a "where not exists" on
-- (full_name, category) [plus title for the one person listed twice in a
-- category], and the constraint swap / Agbeja update are safe to repeat.

begin;

-- 0010 created leaders_category_check without past_secretary/past_treasurer,
-- which lib/leaders.ts and /leadership/past already use. Bring the
-- constraint in line with lib/leaders.ts's LeaderCategory union.
alter table cacna.leaders drop constraint if exists leaders_category_check;
alter table cacna.leaders add constraint leaders_category_check check (category in (
  'cacna_regional', 'global_hq', 'zonal_superintendent', 'past_president', 'past_superintendent', 'past_evangelist', 'past_secretary', 'past_treasurer', 'bible_institute', 'dcc_superintendent'
));

-- The existing Regional Superintendent row (seeded in 0010) gets its
-- person_key so it links to his WADCC row below, and his profile bio if it
-- has none yet.
update cacna.leaders
   set person_key = 'timothy-agbeja',
       bio = coalesce(bio, 'A Statement of Introduction

Pastor Timothy Akinlolu Omolayo Oyewumi Agbeja was born in IIesha, Osun State Nigeria to the late Pastor Abraham Olayiwola Agbeja ( a District Superintendent in the Christ Apostolic Church) and Madam Lydia Folorunsho Pastor (Dr.) Timothy Akinlolu Omolayo Agbeja has been the beIoved pastor and teacher of the Christ Apostolic Church and mission for forty consecutive years. His dedicated service has been through the ranks of the clergy and in a wide range of socio-economic milieu from a little village in Idanre, Ondo State Nigeria where he started as a Catechist, to the United Kingdom as an associate/freelance pastor and to his present much coveted status of the Co-ordinator of C.A.C. North America and Canada.

Education Background

Pastor Agbeja, who had both his elementary and secondary education at his home town Ilesha, is a graduate of Christ Apostolic Church Theological Seminary in Nigeria from 1974 to 1976 and The Assemblies of God Bible College, Mattersey Hall England in 1983, with Diploma in Theology with Merit, he holds a Bachelor of Science degree from Somerset University, Somerset England (l984/85), Master of Theology (1987) and a PhD in Theology (1992) both from International Seminary, Plymouth Florida (USA). He also hold a Master of Art in Christian Care and Counseling from ShIelhoune University, Northern Ireland (2000) as an enhancement of his ever functional spiritual gift He is a chartered member of The American Association of Christian Counselors (AACC) and a Certified Temperament Counselor and a Professional Clinical member of: National Christian Counselors’ Association Since his call to the Ministry in 1974, Pastor Agbeja has distinguish himself as an ardent orator, a sagacious counselor, a tenacious builder, a faithful ministry father, an articulate teacher and an anointed preacher a man of overwhelming spiritual gifts. To God be the Glory! Above all these credentials, Pastor Agbeja is a born again Christian Minister who likes to minister rather than to be ministered unto. To him leadership is service!

Dr. Agbeja’s spiritual gift instantaneously showcased him as a missionary whose visionary leadership has planted and pioneered many churches in many states since when he migrated to the USA, Most of these churches continue to bubble with the power and vigor of the Holy Spirit till to day.

As a teacher of The Word he has the double honors of serving as the Principal of the WOSEM Bible College and Theological Seminary, Akure and at the same period as head of The Christian Education Department of the World Soul-Winning Evangelistic Ministry (WOSEM) also in Akure, Nigeria for two and a half years. He served as the Provost of the Washington metropolis campus of the International Seminary and an associate Professor at Bethel University of Biblical Studies, Sliver Spring, MD., all of these to the glory of God.

Dr. Agbeja has preached the gospel in many countries throughout the WorId as weIl as to the mainline denominations and quasi church bodies in Nigeria,U.K. and America. Detail highlights as full:

1. Evangelist In-Charge, Christ Apostolic Church, Okedo / Oke Ododo Street Idanre, Ondo State, Nigeria 1976-1978.

2. Evangelist In Charge, Christ Apostolic Church; Bariga/Oworonshoki, Lagos, Nigeria. 1978 – 1981. The Church moved from Bariga to Oworonshoki where he worked with the Church in constructing a brand new duplex mission house and a brand new Cathedral Church Building.

3. Joint Pioneer/Associate Minister, Christ Apostolic Church Stoke Newington which later moved to a permanent site at Seven Sisters, Tottenham High Road. London N15. A big Cathedral like building formerly owned by the (Salvation Army which closed down for lack of growth). 1981 – 1984 4. Principal / Head of Christian Education Dept; WOSEM-Theological College, Akure, Nigeria – 1985 to 1987. In charge of administration, developed new curriculum and instructional materials. 75 Students.

5. Help Inaugurated the Church in Providence Rhode Island in 1986 during his first visit to USA.

6. Pioneer Pastor, Christ Apostolic Church, Miami Florida – 1987 to 1988. (Growth – about 75 members.)

7. Senior Pastor, Christ Apostolic Church, New York— 1988 to l990 In charge of overall shepherding of the Church with growth from about 70 to over 165 members.

8. Pioneer/Snr. Pastor, Christ Apostolic Church, Los Angeles, (1990-1995) Starting the Church with few members grown to over 85 in two years. Planted another one in 1992 which is still growing in-spite of many challenges and God has caused to grow steadily, both spiritually and in physical.

9. District Superintendent / Assistant General Superintendent Christ Apostolic Church, Washington /Southern California Districts – 1996 to 2003.

10. Chairman/Snr Pastor Christ Apostolic Church Washington / DCC. Christ Apostolic Church Hyattsville, the Headqt., from December 1995 to December 2011, in charge of overall shepherding of over 500 members. In charge of administration of Churches in four Districts.

He led C.A.C House of Praise (HOP) in pastoral care and evangelism since the Lord sent him to Washington in 1995. Pastor Agbeja was typically the Moses that led the church family from its old 11th Street location into their new five hundred thousand dollar property at Edmonston Road in Hyattsville, Maryland, with less than 100 membership. Since then, Christ Apostolic Church (HOP) is known for its energized church growth ministries in praise and worship, witnessing and youth education. More than 100 people have been encouraged to enter the gospel ministry under his pastoral care, with some serving as pastors in several churches. The tremendous growth of the Church demand for a need to start the planning to developed their almost two acres of land, a two phase project was then determined. To the glory of God he led the Church into the building and completion of the present state of art edifice, built from the ground up at the rough estimated amount of over 2.3million dollars, which is the first phase of the project and was dedicated in July 2009 by the former President of the Mission, Pastor E. H. L. Olusheye; the arrangement is going on the commencement of the second phase by the grace of God.

11. Superintendent / Snr Pastor Christ Apostolic Church, House of The Word; the headquarters of C.A.C. California DCC – December 30th, 2011 to September 30th, 2015.

12.Just being transferred back to Washington DCC after his promotion to the office of the Coordinator of C.A.C. North America, C.A.C. House of Praise is now the Administrative Office and Headquarters of C.A.C. North America, on October 1st, 2015.

Dr Timothy Omolayo Agbeja is one of the foundation/pioneer member of the Pan-African Organization which was established in New York under the inspiration of a Nigerian – Chief Jumoke Ogunkeyede in 1989 that co-ordinate the affairs of African and African in Diaspora. And due to Dr. Agbeja’s beliefs for a strong unity among ministers of the gospel -especially within the Pentecostal and Evangelical circles; he worked strongly for the development of the ministers’ Council in New York City, under the tagged name United African Ministers’ Council where he served as the Vice Chairman from 1989 to 1990.

He repeated the same effort while he was in Los Angeles, California as he helped in organizing “The African Ministers’ Council” together with some well meaning spiritual leaders, he also served there in the capacity of the Vice President until December 1995. He was also the Spiritual Adviser to a joint political Organization of all Nigerian sub-political groups in Southern California called “The Organization of Nigerian Unity (ONU); He also served as the Member of the Los Angeles County School District Advisory Committee from 1993 to 1995. Soon as he arrives in Washington D.C. metropolitan area, he joined-the already existing “The Nigerian ministers’ Council” and he at a point serve as the Vice President of the Organization.

His Church worked in full support of “African For Jesus” Prayer movement and” IGO Ministries”, an organization which passionately work for the Spiritual, Socio-economical and educational advancement of the people in the Continent of Africa in providing for the need of the less privilege, supporting social structures, building orphanages and providing spiritual-stability in different Countries of African, he had made quite a number of journey with this organization on Mission purpose at his own expense to Nigeria, Democratic Republic of Congo, Ethiopia, and just recently to Dar Es Salaam in Tanzania, he also serve as the Vice Chairman of the of Director of this Organization –2000 to present.

His Church under his leader is also a strong member of the “Collective Banking Group”, an organization which represent a large spectrum of different Christian Churches and Ministries from Washington D.C. to Baltimore that work together for the economic development of black Churches – From 1997 to 2010 He is a full fledged member of the African Strategic Leadership Prayer Network (ASLPN), a non-profit Christian charitable organization dedicated to prayer and intercession to get America Back to Christ – He served as the Chairman of the Mobilization Department of the organization – From 2009 to Present He is also a proud member of the Christian Association Of Nigerian American ( CANAN), a non-profit Christian Charitable Organization whose Vision is: To be the leading voice of Nigerian-American Christians and their immigrant communities within and outside the USA, advancing their interests, views and their causes – He served as member of the Board of Trustee of the Organization – 2012 to Present He is so proud of his heritage as a Yoruba man he is well known among fellow Nigerians for his passionate love for his home country and his believes in the African heritage and culture which earn him the alias “Home Boy” from those who knows him very well. He has donated generously to many Nigerian organizations home and abroad and served as the President of “Pastor Abraham Olayiwola Agbeja Memorial Scholarship Foundation”, an organization he established in memory of his late father, which presently sponsoring five students through their high school certificate and a choosing one student in one of our University in Nigeria. His leisure time is spent with his children watching movie, reading and browsing through his laptop.

Awards & Honors:

Dr. Timothy Agbeja has received many awards and honors for his civil services and scholastics duties, among which are: The American Christian Leadership Council’s inclusion in “Who Is Who in Christian Leadership”, 1989 edition; “Distinguished Representation Award” by the Los Angeles County School District Advisory Committee,. June 1995; His appearance at the prestigious Marquis “Who Is Who among the Christian Leadership” edited in the Library of Congress 1999 edition; Award-as “Honored Professional” in the “National Register’s Who Is Who in the Executives and Professionals”, edited in the Library of Congress 2000 edition; Town of Bladensburg Proclamation in Commemoration of his elevation to the rank of “Chairman” in the Christ’ Apostolic Church Organization which is the equivalent of Bishop by the City Mayor 2004. Another Proclamation in commemoration of his Birthday in 2012 by the City Mayor represented by Councilman Ficklin Walker. Also a Certificate of Congressional Commendation, in commemoration of his Forty Years in the Ministerial Service in October 18th, 2014.

Pastor Timothy Agbeja is married to Evangelist Agnes Adebomi, nee Adeniji both working as a team of two-in-one minister. They are blessed with five children with a divine selection of all their initials—,Bukky, Bumni, Bola, Bisi and Bode. He considers his family his greatest earthly blessing.'),
       updated_at = now()
 where full_name = 'Pastor Dr. T.O. Agbeja' and category = 'cacna_regional';

-- ---------- zonal_superintendent ----------
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Samson Kunle Aroniyo', 'Superintendent', 'zonal_superintendent', null, '/images/leaders/samson-aroniyo.jpg', 'Atlanta', null, null, null::integer, null::integer, 1, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Samson Kunle Aroniyo' and l.category = 'zonal_superintendent');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Chris Ogunleye', 'Superintendent', 'zonal_superintendent', null, '/images/leaders/chris-ogunleye.jpg', 'Philadelphia', null, null, null::integer, null::integer, 2, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Chris Ogunleye' and l.category = 'zonal_superintendent');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Abayomi Ademuwagun', 'Superintendent', 'zonal_superintendent', null, '/images/leaders/abayomi-ademuwagun.jpg', 'North Washington', null, null, null::integer, null::integer, 3, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Abayomi Ademuwagun' and l.category = 'zonal_superintendent');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Amos Adetobi', 'Superintendent', 'zonal_superintendent', 'About the Senior Pastor

Pastor Amos Adetobi is the Lead Pastor for Christ Apostolic Church (Overcomers Chapel). A man of integrity with a wealth of experience, and one with a tremendous zeal for the work of God. He is a creative thinker and is passionate about seeing people following our Lord Jesus Christ. He has the habit of encouraging others to discover and develop their God-given talents. A man of faith and prayer who believes that with God nothing shall be impossible.

As a young man in the early eighties in Nigeria, he has been fully involved in various ministries in the Church; first with the evangelical arm of the Church called ‘The Light of the World” whose activities include evangelism and church planting. He also served as a leader in charge of various ministries and departments such as Evangelism, Prayer Warriors, Choir, Ushering, Finance, and Events Planning. Due to gifts and services, the Church ordained him an Elder in the mid-eighties to assist the Pastor of his local Church in ministrations and other duties assigned to him.

On his arrival in the United States in the early 1990s, he together with others spearheaded a true reorganization of the Church in the Washington area that would eventually bring the church to limelight and therefore bring much-anticipated growth and development to Christ Apostolic Church in Washington DC area and the United States in general. Even though there has been several prophesies since his early childhood that he has been chosen by God to be His servant, he finally responded and submit to the call of God in 1997 when he was ordained as an Evangelist and later as an ordained Pastor in Chicago Illinois in July 1998 by the then C. A. C. President Pastor Elijah H. Olusheye.

In September 1998, he was given the assignment to start a branch of the Church in Gaithersburg, Maryland (Christ Apostolic Church – Overcomers Assembly) where he served for four and half years until he was chosen to spearhead the present Church in the Silver Spring area in March 2003.

He holds the Higher National Diploma in Civil Engineering from College of Technology, Yaba Lagos, Nigeria; Advance Level Diploma in Practical Theology from International Seminary, Plymouth, Florida; Bachelor of Arts in Biblical Studies from Bible University, Baltimore and presently studying for his Masters in Theology. He is a Certified Pastoral Counselor from Sarasota Academy of Christian Counseling, Florida.

Married to his wife Esther, a fellow minister and a God-fearing woman, and they are blessed with four godly children.', '/images/leaders/amos-adetobi.jpg', 'Cornerstone', null, null, null::integer, null::integer, 4, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Amos Adetobi' and l.category = 'zonal_superintendent');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Ebenezer S. Akinyele', 'Superintendent', 'zonal_superintendent', null, '/images/leaders/ebenezer-akinyele.jpg', 'SW Houston', null, null, null::integer, null::integer, 5, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Ebenezer S. Akinyele' and l.category = 'zonal_superintendent');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Zacheous Oloba', 'Superintendent', 'zonal_superintendent', null, null, 'VOC Atlanta', null, null, null::integer, null::integer, 6, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Zacheous Oloba' and l.category = 'zonal_superintendent');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Ezekiel Olasumbo Adebunmi', 'Superintendent', 'zonal_superintendent', null, null, 'Dallas North', null, null, null::integer, null::integer, 7, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Ezekiel Olasumbo Adebunmi' and l.category = 'zonal_superintendent');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Ademola Oyeniyi', 'Superintendent', 'zonal_superintendent', null, '/images/leaders/ademola-oyeniyi.jpg', 'Agbala Itura Canada', null, null, null::integer, null::integer, 8, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Ademola Oyeniyi' and l.category = 'zonal_superintendent');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Amos Dada Ph.D.', 'Superintendent', 'zonal_superintendent', 'Ministry

Dr. Amos Dele Dada is a Chemical Engineer by training and a Preacher, Teacher, Pastor, and Evangelist by calling. The District Superintendent and Pastor-in-charge of Christ Apostolic Church Bethel Toronto and Director of Mission CAC Bethel District of North America.

Personal Life

Pastor Dada strongly believes that marriage should be between man and woman and he is an advocate of ‘no divorce’. He currently ministers in Christ Apostolic Church Bethel Toronto with his wife, anointed; Holy Spirit filled Lady Evangelist Eyitayo Dada a Legal Practitioner, Administrator and Consultant on Environmental Law. Their children are blessed and they are obvious assets to the body of Christ.

Church Planting

Pastor Dada who gave his life to be a follower of Christ on February 10, 1977 has been used of God to plant churches and to minister the word of God across the globe.

Missions

In 2003, as directed by the Lord, himself and his wife commenced International Gathering of Eagles Conference, this is one way by which he has been used of God to put Canada on the spiritual map of the world. This annual conference attracts Christians from all continents of the world and thereby affects the social, tourist and spiritual landscape of Canada positively.

Pastor Dada has ministered in over 41 nations of the world, some of the nations he has ministered including, South Africa, Germany, France many States in the U.S.A, Nigeria, Israel, Portugal, India, Singapore, Malaysia, Sri Lanka, Dominican Republic, Haiti, Netherlands, Scotland, Britain, Kenya, Uganda, Ethiopia, Eritrea and of recent Libya and Ghana to mention but a few.', '/images/leaders/amos-dada.jpg', 'Bethel Canada', null, null, null::integer, null::integer, 9, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Amos Dada Ph.D.' and l.category = 'zonal_superintendent');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Michael Ekemode', 'Superintendent', 'zonal_superintendent', null, null, 'Orlando', null, null, null::integer, null::integer, 10, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Michael Ekemode' and l.category = 'zonal_superintendent');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Isaac Abiara', 'Superintendent', 'zonal_superintendent', 'A Statement of Introduction

The Senior Pastor of Christ Apostolic Church, Vineyard of Comfort, Dallas Texas, Pastor Isaac Abiara has described Prophet Samuel K. Abiara has a loving father who has compassionate not only for his biological children, but everyone.

Pastor Abiara who is the eldest child of Prophet Abiara stated this in an exclusive interview with CAC News.

In his exact words;"my Dad is a man of God to the core. I don’t see him as my biological father, but as a man of God. His relationship with God is so deep and genuine that you won’t be surprised God is doing what He is doing in His life. He doesn’t joke with his walk with God. At 79, he still fasts for four to five days in a week. Sometimes he will fast for 21 days. He is always on the floor praying every single morning from 3am-6am.

"On the physical side, he is a loving and caring father. He may not show it, particularly in the public. People in his generation don’t like to show emotions. As Yoruba people will call it, Baba is a genuine “Abiyamo.”

"Baba has so much compassion for people. Considering his pedigree, if he wants to be riding jet he will do so, but he shows compassion on people. If you give Baba ten million naira today right in your presence he will be sharing it to people because he genuinely cares for everyone.

"I see more of his cares on how he took care of my late mum. He was there till the end for my mum. Throughout Mama’s sickness, Baba spent all he had to take care of her and that taught me a lot on how to be a better husband. He’s a man that generally cares for others."', '/images/leaders/isaac-abiara.jpg', 'VOC Texas', null, null, null::integer, null::integer, 11, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Isaac Abiara' and l.category = 'zonal_superintendent');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Bode Olatunji', 'Superintendent', 'zonal_superintendent', null, null, 'Tampa', null, null, null::integer, null::integer, 12, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Bode Olatunji' and l.category = 'zonal_superintendent');

-- ---------- dcc_superintendent ----------
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Dr. T.O. Agbeja', 'Superintendent', 'dcc_superintendent', null, '/images/pastor-agbeja-portrait.jpg', 'WADCC', null, null, null::integer, null::integer, 1, 'timothy-agbeja', true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Dr. T.O. Agbeja' and l.category = 'dcc_superintendent');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor David Adenodi, Ph.D.', 'Superintendent', 'dcc_superintendent', null, '/images/leaders/david-adenodi.jpg', 'Agbala Itura DCC, USA', null, null, null::integer, null::integer, 2, 'david-adenodi', true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor David Adenodi, Ph.D.' and l.category = 'dcc_superintendent');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Timothy Adelani', 'Superintendent', 'dcc_superintendent', null, '/images/leaders/timothy-adelani.jpg', 'Manhattan DCC', null, null, null::integer, null::integer, 3, 'timothy-adelani', true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Timothy Adelani' and l.category = 'dcc_superintendent');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor John Oluwatimilehin, Ph.D.', 'Superintendent', 'dcc_superintendent', 'About the Pastor

Born in Nigeria where he gave his life to Christ in 1975.  He went to Obafemi Awolowo University, (OAU) Ile-Ife, Nigeria where he obtained a Doctorate degree in Geography.  He was called to the ministry in 1978, mentored and disciplined by many leaders in Christ Apostolic Church (CAC) and ordained as a pastor in 1989 after a short training in the CAC Seminary.

He served as Associate Pastor in CAC Bethel, OAU, Ile-Ife, Nigeria before relocating to the United States of America in 1993.  He is the current Superintendent of all CAC (Bethel) DCC in USA and Canada.

Pastor John is a man with great passion for prayer and a belief in the limitless power of God and His Words.  That is the bedrock of his faith and leadership.

He''s married to Lady Evangelist Susan Oluwatimilehin and are blessed with four children and three grandchildren.', '/images/leaders/john-oluwatimilehin.jpg', 'Bethel DCC', null, null, null::integer, null::integer, 4, 'john-oluwatimilehin', true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor John Oluwatimilehin, Ph.D.' and l.category = 'dcc_superintendent');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Hezekiah Ilufoye, D.Min.', 'Superintendent', 'dcc_superintendent', null, '/images/leaders/hezekiah-ilufoye.jpg', 'Baltimore DCC', null, null, null::integer, null::integer, 5, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Hezekiah Ilufoye, D.Min.' and l.category = 'dcc_superintendent');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Rufus Adeagbo, Ph.D.', 'Superintendent', 'dcc_superintendent', null, null, 'New England DCC', null, null, null::integer, null::integer, 6, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Rufus Adeagbo, Ph.D.' and l.category = 'dcc_superintendent');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Sola Rotimi', 'Superintendent', 'dcc_superintendent', null, '/images/leaders/sola-rotimi.jpg', 'South Florida DCC', null, null, null::integer, null::integer, 7, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Sola Rotimi' and l.category = 'dcc_superintendent');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Gabriel Idowu', 'Superintendent', 'dcc_superintendent', null, '/images/leaders/gabriel-idowu.jpg', 'California DCC', null, null, null::integer, null::integer, 8, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Gabriel Idowu' and l.category = 'dcc_superintendent');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Olufemi Olaluwoye', 'Superintendent', 'dcc_superintendent', null, '/images/leaders/olufemi-olaluwoye.jpg', 'Eastern DCC', null, null, null::integer, null::integer, 9, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Olufemi Olaluwoye' and l.category = 'dcc_superintendent');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Joseph A. Olawale', 'Superintendent', 'dcc_superintendent', null, '/images/leaders/joseph-olawale.jpg', 'Texas DCC', null, null, null::integer, null::integer, 10, 'joseph-olawale', true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Joseph A. Olawale' and l.category = 'dcc_superintendent');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Samuel Olomoniyi, Ph.D.', 'Acting Superintendent', 'dcc_superintendent', null, '/images/leaders/samuel-olomoniyi.jpg', 'Western DCC', null, null, null::integer, null::integer, 11, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Samuel Olomoniyi, Ph.D.' and l.category = 'dcc_superintendent');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Gbenga Famojuro, D.Min.', 'Superintendent', 'dcc_superintendent', null, '/images/leaders/gbenga-famojuro.jpg', 'First In The Americas DCC', null, null, null::integer, null::integer, 12, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Gbenga Famojuro, D.Min.' and l.category = 'dcc_superintendent');

-- ---------- cacna_regional ----------
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor David Adenodi, Ph.D.', 'Chairman, CACNA Convention · Member, CACNA Coordinating Council', 'cacna_regional', null, '/images/leaders/david-adenodi.jpg', null, null, null, null::integer, null::integer, 1, 'david-adenodi', true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor David Adenodi, Ph.D.' and l.category = 'cacna_regional');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Joseph A. Olawale', 'Latunde Regional Secretary, CACNA · Member, CACNA Coordinating Council', 'cacna_regional', null, '/images/leaders/joseph-olawale.jpg', null, null, null, null::integer, null::integer, 2, 'joseph-olawale', true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Joseph A. Olawale' and l.category = 'cacna_regional');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Timothy Adelani', 'Latunde Regional Treasurer, CACNA · Member, CACNA Coordinating Council', 'cacna_regional', null, '/images/leaders/timothy-adelani.jpg', null, null, null, null::integer, null::integer, 3, 'timothy-adelani', true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Timothy Adelani' and l.category = 'cacna_regional');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor John Oluwatimilehin, Ph.D.', 'Chairman, CAC Village Management Council · Member, CACNA Coordinating Council', 'cacna_regional', null, '/images/leaders/john-oluwatimilehin.jpg', null, null, null, null::integer, null::integer, 4, 'john-oluwatimilehin', true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor John Oluwatimilehin, Ph.D.' and l.category = 'cacna_regional');

-- ---------- bible_institute ----------
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor David Adenodi, Ph.D.', 'Provost, CACNA Bible Institute', 'bible_institute', null, '/images/leaders/david-adenodi.jpg', null, null, null, null::integer, null::integer, 1, 'david-adenodi', true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor David Adenodi, Ph.D.' and l.category = 'bible_institute');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Joseph A. Olawale', 'Registrar, CACNA Bible Institute', 'bible_institute', null, '/images/leaders/joseph-olawale.jpg', null, null, null, null::integer, null::integer, 2, 'joseph-olawale', true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Joseph A. Olawale' and l.category = 'bible_institute');

-- ---------- global_hq ----------
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor S.O. Oladele', 'President, Christ Apostolic Church Nigeria And Overseas', 'global_hq', 'Pastor S.O. Oladele commenced his ministerial training at a very tender age of 14 entered into the ministry by training locally under the late Pastors J.B. Akande and J.O. Ogundiran respectively. He went to the CAC Bible Training College in Akure and graduated in 1974, having trained under late Mrs. O.O.A. Pearce and Pastor M.O. Faloye.', '/images/leaders/samuel-oladele.jpg', null, null, null, null::integer, null::integer, 1, 'samuel-oladele', true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor S.O. Oladele' and l.category = 'global_hq');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor E.O. Odejobi', 'General Superintendent, Christ Apostolic Church Nigeria And Overseas', 'global_hq', 'HIS BACKGROUND:

From grass to grace

The living legend was born on 31st July,1952 to Pa Abraham Odejobi. Pa Odejobi was a pioneer member of Christ Apostolic Church, Oke-Ayo,Baakun  Ipetumodu in Ife North Local Government of Osun State. He is also a farmer, hunter and a leader. The mother of Pastor Odejobi is Mama Maria Omitunde Odejobi who was a Deaconess in The Apostolic Church., Ipetumodu. She is trader who sells Aso-Oke and Kerosene.', '/images/leaders/e-o-odejobi.jpg', null, null, null, null::integer, null::integer, 2, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor E.O. Odejobi' and l.category = 'global_hq');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Prophet H.O. Oladeji', 'General Evangelist, Christ Apostolic Church Nigeria And Overseas', 'global_hq', 'He was born in Oloba Compound, Edun Abon, Osun State on 13 February 1967 to Pa David Oladeji, who is a Christian of the Baptist extraction, and Madam Elizabeth Oyeronke Oladeji. He attended Baptist Primary school, Edun-Abon. He was a brilliant pupil but sickness, which often assailed him and which eventually affected his legs, dulled his chances to read to a level he personally could have desired. As the sickness which almost crippled him continued to assail the young Hezekiah unabated, he lost his mother in 1982, in the quest to get a cure and since the sickness did not allow him to complete his secondary education, his father had to hand him over to Abela Oye, an auto mechanic in Osogbo as an apprentice for a four-year training, but he eventually spent six years.

The Osogbo vocational training was to change the course of his life as he joined the Christ Apostolic Church as a member in 1983 on the day he arrived in the town to commence his four-year apprenticeship as a mechanic. He accepted Jesus as his personal Lord and Saviour and began to devote his life to fasting and prayer. He received healing for his leg problem and did away with crutches. With this miracle, he told God he was going to serve Him in the Christ Apostolic Church forever.

His call into the ministry came soon after he became a truly born again Christian as he devoted himself to God through prayers, fasting, Bible reading and evangelism. Alone in the church one night, in 1985, he saw Jesus Christ and Apostle Babalola in what seems like a daylight vision. They told him: “We are sending you on a mission in Christ Apostolic Church. You must be obedient and must not copy anybody”.

After completing apprenticeship for six years and having served as a journey-man for another two years, he decided to go solo. He tried establishing his own mechanic workshop but all to no avail. He was getting poorer. He had to combine mechanic work with doing menial jobs like carrying goods for people, doing menial jobs on farms as a labourer and just anything for survival. Worried on how to break the poverty shackles, Oladeji continued to seek God’s face in fasting and prayers. He enrolled at Babajide School of Prophets and Evangelist in 1992. Midway on the course, God told Prophet Babajide to single him out for graduation. Prophet Babajide told him, “God had taught you from heaven”. This was during the headship of Pastor Olaniyi. Prophet Babajide signed his certificate and asked him to go and commence his ministerial work but Oladeji did not heed the call. He hid the certificate in a box under his bed and began to continue seeking breakthrough from his mechanic work, yet the work did not prosper as he began to live from hand to mouth.', '/images/leaders/h-o-oladeji.jpg', null, null, null, null::integer, null::integer, 3, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Prophet H.O. Oladeji' and l.category = 'global_hq');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor E.E. Mapur', 'General Secretary, Christ Apostolic Church Nigeria And Overseas', 'global_hq', 'Pastor E. E. Mapur was born on 12th December, 1966 into the family of Mr. and Mrs. Ezekiel Mapur at Bot village, Bokkos, Plateau State.  He attended Local Education Authority Primary School, Bot, Bokkos between 1974 and 1980; CAC College (formerly Gospel Bible Training School), Kuba from 1981 to 1983; United Faith Tabernacle College, Jarawan-Kogi, Plateau State from 1983 to 1986; Ahmadu Belo University, Zaria where he obtained Diploma in Christian Religious Education (2004-2005), Bachelor of Arts in Theology (2007-2008). He also attended Jos ECWA Theological Seminary where he obtained a Master of Arts in Education in 2013.

He was called to the ministry in 1988 and started working as a Teacher (Evangelist) at CAC Wamat, Bokkos.  He attended CAC Theological Seminary, Enugu between 1988 and 1991.  He was ordained a Pastor in Christ Apostolic Church in 1993.', '/images/leaders/e-e-mapur.jpg', null, null, null, null::integer, null::integer, 4, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor E.E. Mapur' and l.category = 'global_hq');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor J.F. Omitinde', 'Finance Director, Christ Apostolic Church Nigeria And Overseas', 'global_hq', 'Pastor J.F. Omitinde was born on July 17, 1951 at Ile-Ife, Osun State to the family of Late Elder and Mrs. Emmanuel Omitinde.', '/images/leaders/j-f-omitinde.jpg', null, null, null, null::integer, null::integer, 5, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor J.F. Omitinde' and l.category = 'global_hq');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor C.S. Fasuyi', 'Missions Director, Christ Apostolic Church Nigeria And Overseas', 'global_hq', 'Human Development (Training)

Mark 3:14 says that Jesus appointed the twelve, that they might be with Him and that He might send them out to preach.

From Luke 6:12 to chapter 8, the appointed were with Jesus before they were sent out to preach in chapter 9.

Like Jesus Christ our Lord, it is our desire to equip our Pastors for the work of the ministry, through structured, result-oriented and continuous spiritual and secular trainings for global impact. The needs of the contemporary church are such that require ministers of God to pick certain skills and competencies to meet them.

It is obvious that many of our Pastors cannot efficiently and effectively handle Church programmes and order of service having not been thoroughly trained before they were ordained.

In the words of a respected retired father “they had been ordained in advance and must be trained in arrears”.

Very soon, we shall come up with the timetable on how the training programme will be run, cutting across all the strata of the Church.

Reconciliation

We are quite certain that every true Christ Apostolic is not only embarrassed but also tired of the in-crisis of C.A.C. Those who are privy to the onset of the crisis will agree that its original elements are either no longer existent or now within our powers to address. Therefore, all hands must be on deck to ensure its prompt and permanent resolution.

We shall no longer expend precious human and material resources to stir the embers of the crisis while our core mandate – the Great Commission – is being impeded. I can assure you that we have made tremendous progress in the reconciliation process and hope that with prayer and some measure of sincerity the crisis will soon be a thing of the past.

We commend the efforts of those who have played one role or another in rebuilding the breached wall of C.A.C. and pray that the Lord will remember you for good, in Jesus’ name.

Evangelism/Church Growth

The word of Jesus Christ, our Lord, remains true that, “the harvest is ripe while the labourers are few”. Luke 10:2.

The needs of the world are quite enormous but the Church is able, by the Grace of God to meet them. We shall pursue a structured pattern of Church growth whose outcome can be measured, evaluated and replicated. Therefore, we seek your co-operation in planting more churches at your district level. This may form part of the metrics for appraisal of our ministers consequently, among others.', '/images/leaders/c-s-fasuyi.jpg', null, null, null, null::integer, null::integer, 6, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor C.S. Fasuyi' and l.category = 'global_hq');

-- ---------- past_president ----------
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Isaac Babalola Akinyele', '1st President', 'past_president', null, '/images/leaders/isaac-akinyele.jpg', null, null, null, 1943, 1964, 1, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Isaac Babalola Akinyele' and l.category = 'past_president');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Josiah S. B. Odusona', '2nd President', 'past_president', null, '/images/leaders/josiah-odusona.jpg', null, null, null, 1964, 1966, 2, 'josiah-odusona', true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Josiah S. B. Odusona' and l.category = 'past_president');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Elijah Titus Latunde', '3rd President', 'past_president', null, '/images/leaders/elijah-latunde.jpg', null, null, null, 1966, 1983, 3, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Elijah Titus Latunde' and l.category = 'past_president');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Joseph Bolade Orogun', '4th President', 'past_president', null, '/images/leaders/joseph-orogun.jpg', null, null, null, 1983, 1991, 4, 'joseph-orogun', true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Joseph Bolade Orogun' and l.category = 'past_president');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor John Dada Obafemi', '5th President', 'past_president', null, '/images/leaders/john-obafemi.jpg', null, null, null, 1993, 1997, 5, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor John Dada Obafemi' and l.category = 'past_president');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Elijah H. L. Olusheye', '6th President', 'past_president', null, '/images/leaders/elijah-olusheye.jpg', null, null, null, 1997, 2011, 6, 'elijah-olusheye', true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Elijah H. L. Olusheye' and l.category = 'past_president');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Abraham O. Akinosun', '7th President', 'past_president', null, '/images/leaders/abraham-akinosun.jpg', null, null, null, 2011, 2021, 7, 'abraham-akinosun', true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Abraham O. Akinosun' and l.category = 'past_president');

-- ---------- past_superintendent ----------
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor David Osmond Odubanjo', '1st General Superintendent', 'past_superintendent', null, '/images/leaders/david-odubanjo.jpg', null, null, null, 1943, 1959, 1, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor David Osmond Odubanjo' and l.category = 'past_superintendent');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor S. Bartholomew Odusona', '2nd General Superintendent', 'past_superintendent', null, '/images/leaders/josiah-odusona.jpg', null, null, null, 1959, 1964, 2, 'josiah-odusona', true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor S. Bartholomew Odusona' and l.category = 'past_superintendent');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor J. A. Medaiyese', '3rd General Superintendent', 'past_superintendent', null, '/images/leaders/j-a-medaiyese.jpg', null, null, null, 1964, 1975, 3, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor J. A. Medaiyese' and l.category = 'past_superintendent');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Joseph Bolade Orogun', '4th General Superintendent', 'past_superintendent', null, '/images/leaders/joseph-orogun.jpg', null, null, null, 1975, 1983, 4, 'joseph-orogun', true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Joseph Bolade Orogun' and l.category = 'past_superintendent');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Abraham O. A. Olutimehin', '5th General Superintendent', 'past_superintendent', null, '/images/leaders/abraham-olutimehin.jpg', null, null, null, 1983, 1991, 5, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Abraham O. A. Olutimehin' and l.category = 'past_superintendent');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Elijah H. L. Olusheye', '6th General Superintendent', 'past_superintendent', null, '/images/leaders/elijah-olusheye.jpg', null, null, null, 1993, 1997, 6, 'elijah-olusheye', true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Elijah H. L. Olusheye' and l.category = 'past_superintendent');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Daniel O. A. Oloye', '7th General Superintendent', 'past_superintendent', null, '/images/leaders/daniel-oloye.jpg', null, null, null, 1997, 2006, 7, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Daniel O. A. Oloye' and l.category = 'past_superintendent');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Paul Olorunfemi Bandele', '8th General Superintendent', 'past_superintendent', null, '/images/leaders/paul-bandele.jpg', null, null, null, 2007, 2010, 8, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Paul Olorunfemi Bandele' and l.category = 'past_superintendent');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Abraham O. Akinosun', '9th General Superintendent', 'past_superintendent', null, '/images/leaders/abraham-akinosun.jpg', null, null, null, 2011, 2012, 9, 'abraham-akinosun', true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Abraham O. Akinosun' and l.category = 'past_superintendent');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor M. O. Agbaje', '10th General Superintendent', 'past_superintendent', null, '/images/leaders/m-o-agbaje.jpg', null, null, null, 2012, 2014, 10, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor M. O. Agbaje' and l.category = 'past_superintendent');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Samuel O. Oladele', '11th General Superintendent', 'past_superintendent', null, '/images/leaders/samuel-oladele.jpg', null, null, null, 2014, 2021, 11, 'samuel-oladele', true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Samuel O. Oladele' and l.category = 'past_superintendent');

-- ---------- past_evangelist ----------
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Prophet Joseph Ayo Babalola', '1st General Evangelist', 'past_evangelist', null, '/images/leaders/joseph-babalola.jpg', null, null, null, 1943, 1959, 1, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Prophet Joseph Ayo Babalola' and l.category = 'past_evangelist');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Prophet David O. Babajide', '2nd General Evangelist', 'past_evangelist', null, '/images/leaders/david-babajide.jpg', null, null, null, 1959, 1991, 2, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Prophet David O. Babajide' and l.category = 'past_evangelist');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Evangelist Jacob O. Alokan', '3rd General Evangelist', 'past_evangelist', null, '/images/leaders/jacob-alokan.jpg', null, null, null, 1993, 2006, 3, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Evangelist Jacob O. Alokan' and l.category = 'past_evangelist');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Prophet Samuel Kayode Abiara', '4th General Evangelist', 'past_evangelist', null, '/images/leaders/samuel-abiara.jpg', null, null, null, 2007, 2017, 4, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Prophet Samuel Kayode Abiara' and l.category = 'past_evangelist');

-- ---------- past_secretary ----------
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor J. A. Sanya', '1st General Secretary', 'past_secretary', null, '/images/leaders/j-a-sanya.jpg', null, null, null, 1943, 1949, 1, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor J. A. Sanya' and l.category = 'past_secretary');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor A. A. Hanson', '2nd General Secretary', 'past_secretary', null, '/images/leaders/a-a-hanson.jpg', null, null, null, 1949, 1968, 2, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor A. A. Hanson' and l.category = 'past_secretary');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Nelson Eku Udofia', '3rd General Secretary', 'past_secretary', null, '/images/leaders/nelson-udofia.jpg', null, null, null, 1968, 1991, 3, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Nelson Eku Udofia' and l.category = 'past_secretary');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Gideon Okegwemeh', '4th General Secretary', 'past_secretary', null, '/images/leaders/gideon-okegwemeh.jpg', null, null, null, 1992, 1993, 4, 'gideon-okegwemeh', true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Gideon Okegwemeh' and l.category = 'past_secretary' and l.title = '4th General Secretary');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Gabriel O. E. Okafor', '5th General Secretary', 'past_secretary', null, '/images/leaders/gabriel-okafor.jpg', null, null, null, 1993, 1998, 5, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Gabriel O. E. Okafor' and l.category = 'past_secretary');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor T. O. Obademi', '6th General Secretary', 'past_secretary', null, '/images/leaders/t-o-obademi.jpg', null, null, null, 1998, 1999, 6, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor T. O. Obademi' and l.category = 'past_secretary');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Gideon Okegwemeh', '7th General Secretary', 'past_secretary', null, '/images/leaders/gideon-okegwemeh.jpg', null, null, null, 1999, 2014, 7, 'gideon-okegwemeh', true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Gideon Okegwemeh' and l.category = 'past_secretary' and l.title = '7th General Secretary');

-- ---------- past_treasurer ----------
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Joseph Bolade Orogun', '1st General Treasurer', 'past_treasurer', null, '/images/leaders/joseph-orogun.jpg', null, null, null, 1943, 1964, 1, 'joseph-orogun', true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Joseph Bolade Orogun' and l.category = 'past_treasurer');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Josiah Adenle Idowu', '2nd General Treasurer', 'past_treasurer', null, '/images/leaders/josiah-idowu.jpg', null, null, null, 1964, 1974, 2, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Josiah Adenle Idowu' and l.category = 'past_treasurer');
insert into cacna.leaders (full_name, title, category, bio, photo_url, zone_name, phone, email, tenure_start, tenure_end, sort_order, person_key, is_published)
select 'Pastor Gabriel O. Olaoye', '3rd General Treasurer', 'past_treasurer', null, '/images/leaders/gabriel-olaoye.jpg', null, null, null, 1974, 1992, 3, null, true
where not exists (select 1 from cacna.leaders l where l.full_name = 'Pastor Gabriel O. Olaoye' and l.category = 'past_treasurer');

commit;
