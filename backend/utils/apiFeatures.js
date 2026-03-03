class APIFeatures {
  constructor(query, queryString) {
    this.query = query;           // Mongoose query (User.find(), Job.find())
    this.queryString = queryString; // req.query
  }

  // 🔍 SEARCH
  // search(fields = []) {
  //   if (this.queryString.search && fields.length > 0) {
  //     const keyword = {
  //       $or: fields.map((field) => ({
  //         [field]: {
  //           $regex: this.queryString.search,
  //           $options: "i",
  //         },
  //       })),
  //     };

  //     this.query = this.query.find(keyword);
  //   }
  //   return this;
  // }

search(fields = []) {
  if (!this.queryString.search) return this;

  const keyword = this.queryString.search.trim();
  if (!keyword) return this;

  const searchQuery = {
    $or: fields.map(field => ({
      [field]: { $regex: keyword, $options: "i" }
    }))
  };

  // 🔥 MERGE SAFELY
  this.query = this.query.find({
    $and: [searchQuery]
  });

  return this;
}

  // 🎯 FILTER (status, department, batch, etc.)
  // filter() {
  //   const queryObj = { ...this.queryString };

  //   const excludeFields = ["search", "page", "limit", "sort"];
  //   excludeFields.forEach((el) => delete queryObj[el]);
  //   if (queryObj.isApproved === "true") queryObj.isApproved = true;
  //   if (queryObj.isApproved === "false") queryObj.isApproved = false;

  //   this.query = this.query.find(queryObj);
  //   return this;
  // }


filter() {
  const queryObj = { ...this.queryString };

  const excludedFields = ["page", "sort", "limit", "search"];
  excludedFields.forEach(el => delete queryObj[el]);

  // 🔥 Regex for location (string search)
  if (queryObj.location) {
    queryObj.location = { $regex: queryObj.location, $options: "i" };
  }

  this.query = this.query.find(queryObj);
  return this;
}


  // 🔃 SORT
  sort(defaultSort = "-createdAt") {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort(defaultSort);
    }
    return this;
  }

  // 📄 PAGINATION
  paginate(resultsPerPage = 10) {
    const currentPage = Number(this.queryString.page) || 1;
    const skip = resultsPerPage * (currentPage - 1);

    this.query = this.query.limit(resultsPerPage).skip(skip);
    return this;
  }
}

module.exports = APIFeatures;
