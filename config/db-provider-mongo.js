// Generated by CoffeeScript 1.7.1
(function () {
    var DbProvider,
        ObjectId,
        Utils,
        db,
        jwt,
        mongoose,
        serverConfig,
        userSchema,
        Users,
        driverSchema,
        Drivers,
        routeHistorySchema,
        RouteHistories,
        bookmarkSchema,
        Bookmarks,
        taxiCompanySchema,
        TaxiCompany,
        likeSchema,
        Likes,
        messageSchema,
        Messages;

    jwt = require('jwt-simple');

    serverConfig = require('./init').serverConfig;

    Utils = require('../utils/utils').Utils;

    mongoose = require('mongoose');


    db = mongoose.connect(serverConfig._db, {
        useMongoClient: true
    });

    db.Mongoose
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });

    // db = mongoose.connection;

    // db.on('error', console.error.bind(console, 'connection error:'));

    // db.once('open', function () {
    //     console.log('MongoDb Opened');
    //     return Utils.logInfo('------------MongoDb Opened');
    // });

    DbProvider = {};

    ObjectId = mongoose.Schema.Types.ObjectId;

    /**
     *
     * TaxiGO Schema
     *
     * */

    userSchema = mongoose.Schema({
        deviceId: { type: String, index: true },
        username: { type: String, required: true, default: 'anon' },
        fullname: { type: String, index: true },
        phone: { type: String },
        birthday: { type: Date },
        location: { type: String },
        avatar: { type: String },
        salt: { type: String, required: true },
        hash: { type: String, required: true },
        role: { type: String, required: true, "default": 'user' }
    }, {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    });

    userSchema.methods.getAccessToken = function () {
        var payload, token;
        payload = {
            foo: 'bar'
        };
        token = jwt.encode(payload, serverConfig._tokenScrete);
        return token;
    };

    Users = mongoose.model('Users', userSchema);

    driverSchema = mongoose.Schema({
        deviceId: { type: String },
        username: { type: String, required: true },
        fullname: { type: String, index: true },
        birthday: { type: Date },
        avatar: { type: String, required: false },
        bio: { type: String },
        location: { type: String },
        like: { type: Number, default: 0 },
        phone: { type: String },
        company: { type: ObjectId, ref: 'TaxiCompany' },
        type: { type: ObjectId, ref: 'DriverTypes' },
        salt: { type: String, required: true },
        hash: { type: String, required: true },
        role: { type: String, required: true, "default": 'taxi' },
        isDestroy: { type: String, default: 'false' }
    }, {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    });

    driverSchema.statics.getPopulation = function () {
        return [
            ['company', '*'],
            ['type', 'typeCode seatNum color carMarker']
        ];
    };

    Drivers = mongoose.model('Drivers', driverSchema);


    var driverTypeSchema = mongoose.Schema({
        company: { type: ObjectId, ref: 'TaxiCompany' },
        typeCode: { type: String, require: true },
        seatNum: { type: Number, require: true, default: 4 },
        color: { type: String, require: true },
        carMarker: { type: String, require: true },
        firstKm: { type: Number, require: true },
        middleKm: { type: Number, require: true },
        lastKm: { type: Number, require: true },
        firstPrice: { type: Number, require: true },
        middlePrice: { type: Number, require: true },
        lastPrice: { type: Number, require: true }
    }, {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    });

    var DriverTypes = mongoose.model('DriverTypes', driverTypeSchema);


    taxiCompanySchema = mongoose.Schema({
        companyName: { type: String, required: true },
        logo: { type: String, required: true },
        address: { type: String, required: true },
        hotline: { type: String, required: true },
        fax: { type: String },
        description: { type: String }
    }, {
        toObject: {
            virtuals: true

        },
        toJSON: {
            virtuals: true
        }
    });

    TaxiCompany = mongoose.model('TaxiCompany', taxiCompanySchema);

    var managerSchema = mongoose.Schema({

        username: { type: String, required: true },
        fullname: { type: String, index: true },
        /*company: {type: ObjectId, ref: 'TaxiCompany'},*/
        avatar: { type: String, index: true },
        salt: { type: String, required: true },
        hash: { type: String, required: true },
        role: { type: String, required: true, "default": 'manager' }
    }, {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    });

    var Managers = mongoose.model('Managers', managerSchema);

    Managers.find(function (err, user) {
        console.log(err);
        console.log(user);
    });

    routeHistorySchema = mongoose.Schema({
        customer: { type: ObjectId, require: true, ref: 'Users' },
        driver: { type: ObjectId, required: true, ref: 'Drivers' },
        startPoint: { type: String, required: true },
        endPoint: { type: String, require: true },
        duration: { type: String, default: 0 },
        distance: { type: String, default: 0 },
        startAt: { type: Date, default: Date.now },
        endAt: { type: Date, default: new Date() },
        amount: { type: String, default: 0 },
        deleteReason: { type: String },
        status: { type: Number, default: 0 },
        roomID: { type: String, require: true },
        destroyBy: { type: ObjectId, ref: 'Managers' },
        destroyed: { type: Boolean, default: false }
    }, {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    });

    routeHistorySchema.statics.getPopulation = function () {
        return [
            ['driver', 'username fullname company type bio phone location avatar isDestroy role like'],
            ['customer', '_id username deviceId phone'],
            ['destroyBy', 'fullname']
        ];
    };

    RouteHistories = mongoose.model('RouteHistories', routeHistorySchema);


    messageSchema = mongoose.Schema({
        from: { type: ObjectId, ref: 'TaxiCompany' },
        to: { type: ObjectId, ref: 'Users', require: true },
        title: { type: String, require: true },
        body: { type: String, require: true },
        status: { type: Number, default: 0 },
        isSystem: { type: Number, default: 0 },
        time: { type: Date, default: new Date() }
    }, {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    });


    messageSchema.statics.getPopulation = function () {
        return [
            ['from', '*'],
            ['to', '_id username deviceId phone']
        ];
    };

    Messages = mongoose.model('Messages', messageSchema);

    var messageRelationSchema = mongoose.Schema({
        message: { type: ObjectId, ref: 'Messages' },
        user: { type: ObjectId, ref: 'Users' },
        readed: { type: Number, default: 0 },
        deleted: { type: Number, default: 0 }
    }, {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    });

    messageRelationSchema.statics.getPopulation = function () {
        return [
            ['message', '*'],
            ['user', '_id username deviceId phone']
        ];
    };

    var MessageRelation = mongoose.model('MessageRelation', messageRelationSchema);

    var myTaxiSchema = mongoose.Schema({
        driver: { type: ObjectId, ref: 'Drivers', require: true },
        customer: { type: ObjectId, ref: 'Users', require: true },
        time: { type: Date, default: Date.now }
    }, {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    });

    myTaxiSchema.statics.getPopulation = function () {
        return [
            ['driver', '_id username company type bio fullname'],
            ['customer', '_id username deviceId phone']
        ];
    };
    var MyTaxi = mongoose.model('MyTaxi', myTaxiSchema);


    var reportSchema = mongoose.Schema({
        user: { type: ObjectId, ref: 'Users' },
        driver: { type: ObjectId, ref: 'Drivers' },
        content: { type: String, required: true },
        route: { type: ObjectId, ref: 'RouteHistories', required: true },

        time: { type: Date, require: true, default: new Date() }
    }, {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    });

    var Reports = mongoose.model('Reports', reportSchema);

    bookmarkSchema = mongoose.Schema({
        customer: { type: ObjectId, ref: 'Customers' },
        bookmarkPoint: { type: String, require: true },
        bookmarkAt: { type: Date, require: true, default: new Date() }

    }, {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    });

    Bookmarks = mongoose.model('Bookmarks', bookmarkSchema);


    likeSchema = mongoose.Schema({
        customer: { type: ObjectId },
        driver: { type: ObjectId, ref: 'Drivers' },
        time: { type: Date, default: new Date() }
    }, {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    });

    Likes = mongoose.model('Likes', likeSchema);

    /**
     * End blog Database
     * */


    /*
     Attach model to DbProvider and Export
     */


    DbProvider.Users = Users;
    DbProvider.Drivers = Drivers;
    DbProvider.DriverTypes = DriverTypes;
    DbProvider.TaxiCompany = TaxiCompany;
    DbProvider.RouteHistories = RouteHistories;
    DbProvider.Messages = Messages;
    DbProvider.Bookmarks = Bookmarks;
    DbProvider.Likes = Likes;
    DbProvider.Managers = Managers;
    DbProvider.MyTaxi = MyTaxi;
    DbProvider.MessageRelation = MessageRelation;
    DbProvider.Reports = Reports;
    DbProvider = {
        Users: Users, Drivers: Drivers, DriverTypes: DriverTypes, TaxiCompany: TaxiCompany,
        RouteHistories: RouteHistories, Messages: Messages, Bookmarks: Bookmarks, Likes: Likes, Managers: Managers,
        MyTaxi: MyTaxi, MessageRelation: MessageRelation, Reports: Reports
    };

    // console.log(DbProvider);
    exports.MongooseDbProvider = DbProvider;

}).call(this);

//# sourceMappingURL=db-provider-mongo.map
