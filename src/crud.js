// sqlite crud wrapper

class Table {

    constructor(db, name, columns) {
        this.db = db;
        this.name = name;
        this.db.exec(`CREATE TABLE IF NOT EXISTS ${name} (${columns.join(',')})`);
    }

    insert(values)     { return new InsertQuery(this, values); }
    select(...columns) { return new SelectQuery(this, columns); }
    update(values)     { return new UpdateQuery(this, values); }
    delete(condition)  { return new DeleteQuery(this, condition); }

}

class Query {

    constructor(table) {
        this.table = table;
    }

    // this method should return the query string
    query() {
        throw new Error("Not implemented");
    }

    stmt(options) {
        const stmt = this.table.db.prepare(this.query());
        if(options?.pluck) stmt.pluck();
        return stmt;
    }

    fn(options) {
        const stmt = this.stmt(options);
        if(stmt.reader) {
            if(options?.all) return stmt.all.bind(stmt);
            if(options?.iterate) return stmt.iterate.bind(stmt);
            return stmt.get.bind(stmt);
        }
        return stmt.run.bind(stmt);
    }

}

class InsertQuery extends Query {

    constructor(table, values) {
        super(table);
        this.values = values;
    }

    or(fallback) {
        this.fallback = fallback;
        return this;
    }

    query() {
        const parts = ["INSERT"];   
        if(this.fallback) parts.push("OR", this.fallback);
        parts.push("INTO", this.table.name);
        if(Array.isArray(this.values)) 
            parts.push("(" + this.values.join(",") + ") VALUES (" + this.values.map(s => ":" + s).join(",") + ")");
        else
            parts.push("(" + Object.keys(this.values).join(",") + ") VALUES (" + Object.values(this.values).join(",") + ")");
        return parts.join(" ");
    }

}

class SelectQuery extends Query {

    constructor(table, columns) {
        super(table);
        this.columns = columns;
    }

    where(condition) {
        this.condition = condition;
        return this;
    }

    orderBy(sortColumn) {
        this.sortColumn = sortColumn;
        return this;
    }

    limit(count) { 
        this.count = count;
        return this;
    }

    query() {
        const parts = ["SELECT", this.columns.join(","), "FROM", this.table.name];
        if(this.condition) parts.push("WHERE", this.condition);
        if(this.sortColumn) parts.push("ORDER BY", this.sortColumn);
        if(this.count) parts.push("LIMIT", this.count);
        return parts.join(" ");
    }

}

class UpdateQuery extends Query {

    constructor(table, values) {
        super(table);
        this.values = values;
    }

    where(condition) {
        this.condition = condition;
        return this;
    }

    query() {
        const parts = ["UPDATE", this.table.name, "SET", Object.entries(this.values).map(value => value.join('=')).join(',')];
        if(this.condition) parts.push("WHERE", this.condition);
        return parts.join(" ");
    }
    
}

class DeleteQuery extends Query {

    constructor(table, condition) {
        super(table);
        this.condition = condition;
    }

    query() {
        return `DELETE FROM ${this.table.name} WHERE ${this.condition}`;
    }

}

module.exports = Table;